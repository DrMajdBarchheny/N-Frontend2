export function scrollToSection(href: string) {
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}
