"use client"

interface LeftTextContentProps {
  currentStep: number
}

const LeftTextContent = ({ currentStep }: LeftTextContentProps) => {
  const sections = [
    "WEBSITES",
    "VIDEO PRODUCTION",
    "BRANDED",
    "EVENTS",
    "WEBSITES", // Duplicate first item for seamless loop
  ]

  return (
    <div className="w-full max-w-lg">
      <div className="portfolio-text-scroll-container">
        <ul
          className="portfolio-text-scroll-list"
          style={{
            transform: `translateY(calc(-${currentStep} * clamp(2.2rem, 5.5vw, 4.4rem)))`,
          }}
        >
          {sections.map((title, index) => (
            <li key={index}>
              <span className="text-white text-[1.75rem] md:text-[2.25rem] lg:text-[2.98rem]">{title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LeftTextContent
