import { forwardRef, ButtonHTMLAttributes } from "react"
import { Button as MuiButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { cn } from "../../lib/utils"

const StyledButton = styled(MuiButton)(() => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '6px',
  transition: 'all 0.2s ease-in-out',
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#FFA500',
    color: '#000000',
    '&:hover': {
      backgroundColor: 'rgba(255, 165, 0, 0.9)',
    },
  },
  '&.MuiButton-outlined': {
    borderColor: '#374151',
    color: '#D1D5DB',
    '&:hover': {
      backgroundColor: '#374151',
      borderColor: '#4B5563',
    },
  },
  '&.MuiButton-text': {
    color: '#FFA500',
    '&:hover': {
      backgroundColor: 'rgba(255, 165, 0, 0.1)',
    },
  },
}))

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    // Map our variants to MUI variants
    const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
      switch (variant) {
        case 'outline':
          return 'outlined'
        case 'ghost':
        case 'link':
          return 'text'
        default:
          return 'contained'
      }
    }

    // Map our sizes to MUI sizes
    const getMuiSize = (): 'small' | 'medium' | 'large' => {
      switch (size) {
        case 'sm':
          return 'small'
        case 'lg':
          return 'large'
        default:
          return 'medium'
      }
    }

    if (asChild) {
      // For asChild behavior, we'll render the children directly
      // This is a simplified version - in a real app you might need more complex logic
      return <>{children}</>
    }

    return (
      <StyledButton
        ref={ref}
        variant={getMuiVariant()}
        size={getMuiSize()}
        className={cn(className)}
        {...props}
      >
        {children}
      </StyledButton>
    )
  }
)

Button.displayName = "Button"

export { Button }