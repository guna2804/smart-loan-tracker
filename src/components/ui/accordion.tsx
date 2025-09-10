import * as React from "react";
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

interface AccordionProps {
  type?: "single" | "multiple"
  children: React.ReactNode
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children, className }) => {
  return (
    <MuiAccordion className={className}>
      {children}
    </MuiAccordion>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className }) => {
  return (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      className={className}
      sx={{
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
        },
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {children}
      </Typography>
    </AccordionSummary>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

const AccordionContent: React.FC<AccordionContentProps> = ({ children, className }) => {
  return (
    <AccordionDetails className={className}>
      <Typography variant="body2">
        {children}
      </Typography>
    </AccordionDetails>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
