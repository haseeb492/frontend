"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        variant,
        action,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="gap-sm flex w-full items-center justify-between">
              <div className="gap-2xs flex flex-col items-start">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {action && action}
              </div>
              <div className="flex items-center justify-center">
                <ToastClose variant={variant || undefined} />
              </div>
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
