import { useState, type FormEvent } from "react"
import { cn } from "../lib/utils"

export type NewsletterFormProps = {
  placeholder?: string
  buttonLabel?: string
  /** called with the submitted email; prevent default handled internally */
  onSubmit?: (email: string) => void
  /** compact = input and button on one row on >=sm */
  compact?: boolean
  /** "light" for light backgrounds, "dark" for dark surfaces */
  tone?: "light" | "dark"
  className?: string
  id?: string
}

/**
 * Email capture form used in the Footer (and reusable anywhere).
 * Self-contained: label, input, and submit button with a success state.
 */
export function NewsletterForm({
  placeholder = "you@example.com",
  buttonLabel = "Subscribe",
  onSubmit,
  compact = false,
  tone = "light",
  className,
  id = "newsletter",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    onSubmit?.(email)
    setDone(true)
  }

  const dark = tone === "dark"

  const input = (
    <>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setDone(false)
        }}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-[6px] border px-3 text-sm transition-colors focus:outline-none focus:ring-2",
          compact && "sm:h-11",
          dark
            ? "border-white/15 bg-white/5 text-[#f4f4ee] placeholder:text-white/40 focus:border-[#b9ed46] focus:ring-[#b9ed46]/30"
            : "border-[#e0dcd0] bg-[#ffffff] text-[#17181c] placeholder:text-[#6d6d75]/60 focus:border-[#1a2410] focus:ring-[#b9ed46]/60"
        )}
      />
    </>
  )

  const button = (
    <button
      type="submit"
      className={cn(
        "h-10 w-full rounded-[6px] text-sm font-semibold transition-colors active:scale-[0.99]",
        compact && "sm:h-11 sm:w-auto sm:px-5",
        dark
          ? "bg-[#b9ed46] text-[#17200e] hover:bg-[#c8f16a]"
          : "bg-[#1a2410] text-[#b9ed46] hover:bg-[#2a3a1a]"
      )}
    >
      {buttonLabel}
    </button>
  )

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-2", compact && "sm:flex-row")}
      >
        {input}
        {button}
      </form>
      {done && (
        <p
          className={cn("mt-2 text-xs font-medium", dark ? "text-[#b9ed46]" : "text-[#1a2410]")}
          role="status"
        >
          Thanks — you're on the list.
        </p>
      )}
    </div>
  )
}

export default NewsletterForm
