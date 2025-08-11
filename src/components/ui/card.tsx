import { forwardRef, HTMLAttributes } from "react"
import { Card as MuiCard, CardContent as MuiCardContent } from '@mui/material'
import { styled } from '@mui/material/styles'
import { cn } from "../../lib/utils"

const StyledCard = styled(MuiCard)(() => ({
  backgroundColor: '#111827',
  border: '1px solid #374151',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  color: '#F9FAFB',
}))

const StyledCardContent = styled(MuiCardContent)(() => ({
  padding: '24px',
  '&:last-child': {
    paddingBottom: '24px',
  },
}))

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <StyledCard
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <StyledCardContent ref={ref} className={cn(className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }