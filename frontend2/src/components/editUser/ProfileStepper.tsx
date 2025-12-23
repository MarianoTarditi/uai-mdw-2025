"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPrev,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

/* ================================
   🔹 ZOD SCHEMA (ALL IN ENGLISH)
================================= */
const formSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  dni: z.string().min(6, "Required"),
  address: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email("Invalid email"),
  profession: z.string().optional(),

  // Emergency Contact
  emergencyName: z.string().min(2),
  emergencyRelation: z.string().min(2),
  emergencyPhone: z.string().min(6),

  // Clinical Info
  hasCurrentInjury: z.string(),
  injuryDescription: z.string().optional(),
  hasMedicalCondition: z.string(),
  conditionDescription: z.string().optional(),
  takesMedication: z.string(),
  medicationDetails: z.string().optional(),

  // Activity History
  hasTrainingExperience: z.string(),
  experienceDetails: z.string().optional(),
  practicesSport: z.string(),
  sportDetails: z.string().optional(),
  frequency: z.string(),
  pastInjuries: z.string().optional(),

  // Goals
  goals: z.string().min(3, "Please describe your goals"),
});

type FormSchema = z.infer<typeof formSchema>;

/* ================================
   🔹 STEPS
================================= */
const steps = [
  {
    value: "personal",
    title: "Personal Details",
    description: "Enter your personal information",
    fields: [
      "firstName",
      "lastName",
      "dni",
      "address",
      "phone",
      "email",
      "profession",
    ] as const,
  },
  {
    value: "emergency",
    title: "Emergency Contact",
    description: "Contact information in case of emergency",
    fields: ["emergencyName", "emergencyRelation", "emergencyPhone"] as const,
  },
  {
    value: "clinical",
    title: "Clinical Information",
    description: "Your current health information",
    fields: [
      "hasCurrentInjury",
      "injuryDescription",
      "hasMedicalCondition",
      "conditionDescription",
      "takesMedication",
      "medicationDetails",
    ] as const,
  },
  {
    value: "activity",
    title: "Activity History",
    description: "Your physical activity background",
    fields: [
      "hasTrainingExperience",
      "experienceDetails",
      "practicesSport",
      "sportDetails",
      "frequency",
      "pastInjuries",
    ] as const,
  },
  {
    value: "goals",
    title: "Goals",
    description: "Tell us about your objectives",
    fields: ["goals"] as const,
  },
];

/* ================================
   🔹 COMPONENT
================================= */
export function ProfileStepper() {
  const [step, setStep] = React.useState("personal");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const stepIndex = steps.findIndex((s) => s.value === step);

  const onValidate: NonNullable<StepperProps["onValidate"]> = React.useCallback(
    async (_, direction) => {
      if (direction === "prev") return true;

      const current = steps.find((s) => s.value === step);
      if (!current) return true;

      const valid = await form.trigger(current.fields);

      if (!valid)
        toast.error("Please complete all required fields before continuing.");

      return valid;
    },
    [form, step]
  );

  const onSubmit = React.useCallback((input: FormSchema) => {
    toast.success(<pre>{JSON.stringify(input, null, 2)}</pre>);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-background p-4">
      <div className="w-full max-w-5xl bg-card shadow-lg rounded-xl p-6 mt-20 border">
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <Stepper value={step} onValueChange={setStep} onValidate={onValidate}>
              <StepperList>
                {steps.map((step) => (
                  <StepperItem key={step.value} value={step.value}>
                    <StepperTrigger>
                      <StepperIndicator />
                      <div className="flex flex-col gap-px">
                        <StepperTitle>{step.title}</StepperTitle>
                        <StepperDescription>{step.description}</StepperDescription>
                      </div>
                    </StepperTrigger>
                    <StepperSeparator className="mx-4" />
                  </StepperItem>
                ))}
              </StepperList>

              {/* ================= PERSONAL ================= */}
              <StepperContent value="personal">
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Last Name */}
                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    name="dni"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID / DNI</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="742 Evergreen St." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 999 111" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    name="profession"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Designer / Developer / Athlete" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </StepperContent>

              {/* ================= EMERGENCY ================= */}
              <StepperContent value="emergency">
                <div className="grid gap-4">
                  <FormField
                    name="emergencyName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="emergencyRelation"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <FormControl>
                          <Input placeholder="Mother / Friend / Partner" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="emergencyPhone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 333 222" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </StepperContent>

              {/* ================= CLINICAL ================= */}
              <StepperContent value="clinical">
                <div className="grid gap-4">
                  {/* Current Injury */}
                  <FormField
                    name="hasCurrentInjury"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you currently have an injury? (Yes/No)</FormLabel>
                        <FormControl>
                          <Input placeholder="Yes / No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="injuryDescription"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Injury Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Explain your injury" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Medical Condition */}
                  <FormField
                    name="hasMedicalCondition"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you have a medical condition? (Yes/No)</FormLabel>
                        <FormControl>
                          <Input placeholder="Yes / No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="conditionDescription"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe the condition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Medication */}
                  <FormField
                    name="takesMedication"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you take medication? (Yes/No)</FormLabel>
                        <FormControl>
                          <Input placeholder="Yes / No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="medicationDetails"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Which medication?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </StepperContent>

              {/* ================= ACTIVITY ================= */}
              <StepperContent value="activity">
                <div className="grid gap-4">
                  <FormField
                    name="hasTrainingExperience"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Do you have previous training experience? (Yes/No)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Yes / No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="experienceDetails"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Explain your experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="practicesSport"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Do you currently practice any sport? (Yes/No)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Yes / No" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="sportDetails"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Which sport?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="frequency"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="How often? (ex: 3 times/week)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="pastInjuries"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Past injuries or discomforts</FormLabel>
                        <FormControl>
                          <Input placeholder="Explain your injury history" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </StepperContent>

              {/* ================= GOALS ================= */}
              <StepperContent value="goals">
                <FormField
                  name="goals"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your fitness goals, objectives, and expectations"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </StepperContent>

              {/* ================= NAVIGATION BUTTONS ================= */}
              <div className="mt-4 flex justify-between">
                <StepperPrev asChild>
                  <Button variant="outline">Previous</Button>
                </StepperPrev>

                <div className="text-muted-foreground text-sm">
                  Step {stepIndex + 1} of {steps.length}
                </div>

                {stepIndex === steps.length - 1 ? (
                  <Button type="submit">Complete</Button>
                ) : (
                  <StepperNext asChild>
                    <Button>Next</Button>
                  </StepperNext>
                )}
              </div>
            </Stepper>
          </form>
        </Form>
      </div>
    </div>
  );
}
