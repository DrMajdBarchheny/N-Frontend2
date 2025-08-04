// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
}

// Email template parameters interface
export interface EmailTemplateParams {
  [key: string]: string | undefined
  from_name: string
  from_company: string
  from_phone: string
  from_email: string
  event_type: string
  event_date: string
  message: string
  phone_country: string
  phone_country_code: string
  to_name: string
  timestamp?: string
}

// Helper function to create email parameters
export const createEmailParams = (formData: any, phoneInfo: any): EmailTemplateParams => {
  return {
    from_name: formData.name,
    from_company: formData.company,
    from_phone: formData.phone,
    from_email: formData.email,
    event_type: formData.eventType,
    event_date: formData.eventDate,
    message: formData.description,
    phone_country: phoneInfo?.country || "Unknown",
    phone_country_code: phoneInfo?.countryCode || "N/A",
    to_name: "Nijara Team",
    timestamp: new Date().toLocaleString(),
  }
} 