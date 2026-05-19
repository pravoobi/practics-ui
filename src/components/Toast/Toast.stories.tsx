 import type { Meta, StoryObj } from "@storybook/react";
  import * as React from "react";
  import { Toaster, toast } from "./Toast";

  const meta: Meta = {
    title: "Components/Toast",
    tags: ["autodocs"],
    decorators: [
      (Story) => (
        <>
          <Story />
          <Toaster position="bottom-right" />
        </>
      ),
    ],
  };

  export default meta;

  export const Default: StoryObj = {
    render: () => (
      <button
        onClick={() => toast({ title: "Event has been created" })}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Show Toast
      </button>
    ),
  };

  export const WithDescription: StoryObj = {
    render: () => (
      <button
        onClick={() =>
          toast({
            title: "Scheduled",
            description: "Monday, January 20th at 9:00 AM",
          })
        }
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Show Toast with Description
      </button>
    ),
  };

  export const Success: StoryObj = {
    render: () => (
      <button
        onClick={() =>
          toast({ title: "Changes saved", description: "Your profile has been updated.", variant: "success" })
        }
        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white"
      >
        Show Success Toast
      </button>
    ),
  };

  export const Warning: StoryObj = {
    render: () => (
      <button
        onClick={() =>
          toast({ title: "Storage almost full", description: "You have used 90% of your storage.", variant: "warning" })
        }
        className="rounded-md bg-yellow-500 px-4 py-2 text-sm text-white"
      >
        Show Warning Toast
      </button>
    ),
  };

  export const Info: StoryObj = {
    render: () => (
      <button
        onClick={() =>
          toast({ title: "New update available", description: "Refresh the page to get the latest version.", variant: "info" })
        }
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
      >
        Show Info Toast
      </button>
    ),
  };

  export const Destructive: StoryObj = {
    render: () => (
      <button
        onClick={() =>
          toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" })
        }
        className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground"
      >
        Show Error Toast
      </button>
    ),
  };

  export const AllVariants: StoryObj = {
    render: () => (
      <div className="flex flex-wrap gap-2">
        {(["default", "success", "warning", "info", "destructive"] as const).map((variant) => (
          <button
            key={variant}
            onClick={() => toast({ title: `${variant} toast`, description: "This is a notification.", variant })}
            className="rounded-md border px-4 py-2 text-sm capitalize"
          >
            {variant}
          </button>
        ))}
      </div>
    ),
  };

  export const Positions: StoryObj = {
    render: () => (
      <div className="flex flex-wrap gap-2">
        {(["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const).map(
          (position) => (
            <div key={position} className="flex flex-col items-center gap-1">
              <Toaster position={position} />
              <button
                onClick={() => toast({ title: position, description: "Toast position demo." })}
                className="rounded-md border px-3 py-1.5 text-xs"
              >
                {position}
              </button>
            </div>
          )
        )}
      </div>
    ),
  };