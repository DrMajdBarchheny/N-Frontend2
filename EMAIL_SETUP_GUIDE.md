# Email Setup Guide for Request Design Form

## Option 1: EmailJS (Recommended - Easy Setup)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>New Design Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ff6b35;">🎨 New Design Request</h1>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">👤 Contact Information</h2>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Company:</strong> {{from_company}}</p>
            <p><strong>Email:</strong> {{from_email}}</p>
            <p><strong>Phone:</strong> {{from_phone}}</p>
            <p><strong>Country:</strong> {{phone_country}} ({{phone_country_code}})</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">📅 Event Details</h2>
            <p><strong>Event Type:</strong> {{event_type}}</p>
            <p><strong>Event Date:</strong> {{event_date}}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">📝 Project Description</h2>
            <p style="white-space: pre-wrap;">{{message}}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; color: #666;">
                This request was submitted from the Nijara website contact form.
                <br>
                <strong>Timestamp:</strong> {{timestamp}}
            </p>
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### Step 5: Update Your Code
Replace the placeholders in `RequestDesignForm.tsx`:

```typescript
const result = await emailjs.send(
  'service_abc123',        // Your Service ID
  'template_xyz789',       // Your Template ID
  templateParams,
  'user_abc123def456'      // Your Public Key
)
```

## Option 2: Backend API (More Secure)

### Using Your Django Backend
Since you have a Django backend, you can create an API endpoint:

```python
# In your Django views
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def send_design_request_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # Prepare email content
        subject = f"New Design Request from {data['name']}"
        message = f"""
        New Design Request Details:
        
        Contact Information:
        - Name: {data['name']}
        - Company: {data['company']}
        - Email: {data['email']}
        - Phone: {data['phone']}
        - Country: {data.get('phone_country', 'Unknown')}
        
        Event Details:
        - Event Type: {data['eventType']}
        - Event Date: {data['eventDate']}
        
        Project Description:
        {data['description']}
        """
        
        # Send email
        send_mail(
            subject,
            message,
            'noreply@yourdomain.com',
            ['your-email@domain.com'],  # Where to receive requests
            fail_silently=False,
        )
        
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=400)
```

Then update your form to call this endpoint:

```typescript
// In RequestDesignForm.tsx
const response = await fetch('/api/send-design-request/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...formData,
    phone_country: phoneInfo?.country,
    phone_country_code: phoneInfo?.countryCode,
  }),
});

if (response.ok) {
  setSubmitStatus("success");
} else {
  setSubmitStatus("error");
}
```

## Option 3: Formspree (No Setup Required)

1. Go to [Formspree.io](https://formspree.io/)
2. Create a free account
3. Create a new form
4. Get your form endpoint URL
5. Update your form to POST to that URL

```typescript
// Simple form submission to Formspree
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

## Recommendation

**For quick setup:** Use EmailJS (Option 1)
**For production:** Use your Django backend (Option 2)
**For no setup:** Use Formspree (Option 3)

## EmailJS Free Plan Limits
- 200 emails per month
- 2 email templates
- 1 email service

## Next Steps
1. Choose your preferred option
2. Follow the setup steps
3. Test the email functionality
4. Customize the email template as needed
5. Add any additional fields you want in the email

Would you like me to help you set up any of these options? 