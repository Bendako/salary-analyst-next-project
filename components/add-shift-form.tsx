"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  Building,
  Briefcase,
  DollarSign,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Define form schema with Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  workType: z.string({
    required_error: "Work type is required",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  startTime: z.string({
    required_error: "Start time is required",
  }),
  endTime: z.string({
    required_error: "End time is required",
  }),
  hourlyRate: z.string({
    required_error: "Hourly rate is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddShiftWorkForm() {
  // State for form completion tracking
  const [formCompleted, setFormCompleted] = useState({
    date: false,
    workType: false,
    location: false,
    time: false,
    rate: false
  });

  const { user } = useUser();
  const addIncomeEntry = useMutation(api.income.addIncomeEntry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnings, setEarnings] = useState<number | null>(null);

  const convexUser = useQuery(
    api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : 'skip'
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workType: "",
      location: "",
      startTime: "",
      endTime: "",
      hourlyRate: "",
      date: undefined,
    },
  });

  const calculateHours = useCallback((start: string, end: string) => {
    if (!start || !end) return 0;
    
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    
    const startMinutesTotal = startHours * 60 + startMinutes;
    const endMinutesTotal = endHours * 60 + endMinutes;
    
    const diffMinutes = endMinutesTotal - startMinutesTotal;
    return diffMinutes > 0 ? diffMinutes / 60 : 0;
  }, []);

  const calculateEarnings = useCallback(() => {
    const values = form.getValues();
    
    // Only calculate if we have all required values
    if (!values.startTime || !values.endTime || !values.hourlyRate) {
      return 0;
    }
    
    const hours = calculateHours(values.startTime, values.endTime);
    const rate = parseFloat(values.hourlyRate) || 0;
    const totalEarnings = hours * rate;
    
    setEarnings(totalEarnings);
    return totalEarnings;
  }, [form, calculateHours]);

  const computeCompletionPercentage = useCallback(() => {
    const completedSections = Object.values(formCompleted).filter(Boolean).length;
    const totalSections = Object.keys(formCompleted).length;
    return Math.round((completedSections / totalSections) * 100);
  }, [formCompleted]);

  const completionPercentage = useMemo(() => 
    computeCompletionPercentage(), 
    [computeCompletionPercentage]
  );

  // Track form completion status - safely subscribe to form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Using type assertion since values might be partial during initialization
      const formValues = values as Partial<FormValues>;
      
      setFormCompleted({
        date: !!formValues.date,
        workType: !!formValues.workType,
        location: !!formValues.location && (formValues.location?.length ?? 0) >= 2,
        time: !!formValues.startTime && !!formValues.endTime,
        rate: !!formValues.hourlyRate
      });
      
      // Only calculate earnings if we have the necessary values
      if (formValues.startTime && formValues.endTime && formValues.hourlyRate) {
        calculateEarnings();
      }
    });
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [form, calculateEarnings]);

  const handleTimeChange = useCallback(() => {
    calculateEarnings();
  }, [calculateEarnings]);

  const onSubmit = async (values: FormValues) => {
    if (!user || !convexUser) {
      toast.error("You must be logged in to add a shift");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Calculate final earnings
      const finalEarnings = calculateEarnings();
      const hours = calculateHours(values.startTime, values.endTime);
      
      await addIncomeEntry({
        userId: convexUser._id,
        amount: finalEarnings,
        date: values.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD
        category: values.workType,
        description: `${values.location} - ${hours.toFixed(2)} hours (${values.startTime} - ${values.endTime})`
      });

      toast.success("Shift added successfully!");
      form.reset(); // Reset form after successful submission
      setEarnings(null);
      setFormCompleted({
        date: false,
        workType: false,
        location: false,
        time: false,
        rate: false
      });
    } catch (error) {
      console.error("Failed to add shift:", error);
      toast.error("Failed to add shift. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-900">
      {/* <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white px-6 py-5"> */}
        {/* <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Add Shift</CardTitle>
            <CardDescription className="text-indigo-100 mt-1">
              Record your work hours and earnings
            </CardDescription>
          </div>
          <Badge 
            variant={completionPercentage === 100 ? "success" : "outline"} 
            className={cn(
              "font-semibold",
              completionPercentage === 100 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {completionPercentage}% Complete
          </Badge>
        </div> */}
      {/* </CardHeader> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-indigo-500" />
                    Date
                    {formCompleted.date && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={field.value ? "outline" : "secondary"}
                          className={cn(
                            "w-full pl-3 text-left font-normal border-slate-300 dark:border-slate-700 h-11",
                            field.value ? "text-gray-900 dark:text-gray-100" : "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-2" />

            {/* Work Type */}
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                    Work Type
                    {formCompleted.workType && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-11 border-slate-300 dark:border-slate-700">
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="school shift" className="py-2.5">School Shift</SelectItem>
                      <SelectItem value="english lesson" className="py-2.5">English Lesson</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-indigo-500" />
                    Location / Institution
                    {formCompleted.location && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="School/Institution name" 
                        {...field} 
                        className="pl-10 h-11 border-slate-300 dark:border-slate-700"
                      />
                      <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-2" />

            {/* Time Fields */}
            <div className="space-y-2">
              <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                Shift Time
                {formCompleted.time && (
                  <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                )}
              </FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="time" 
                            {...field} 
                            className="pl-10 h-11 border-slate-300 dark:border-slate-700"
                            onChange={(e) => {
                              field.onChange(e);
                              handleTimeChange();
                            }}
                          />
                          <span className="absolute left-3 top-3 text-xs font-semibold text-slate-500">FROM</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="time" 
                            {...field} 
                            className="pl-10 h-11 border-slate-300 dark:border-slate-700"
                            onChange={(e) => {
                              field.onChange(e);
                              handleTimeChange();
                            }}
                          />
                          <span className="absolute left-3 top-3 text-xs font-semibold text-slate-500">TO</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                    Hourly Rate
                    {formCompleted.rate && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Safe to use setTimeout since we're client-side only
                      setTimeout(calculateEarnings, 0);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-11 border-slate-300 dark:border-slate-700">
                        <SelectValue placeholder="Select hourly rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="32.31" className="py-2.5">$32.31</SelectItem>
                      <SelectItem value="37.16" className="py-2.5">$37.16</SelectItem>
                      <SelectItem value="80" className="py-2.5">$80.00</SelectItem>
                      <SelectItem value="100" className="py-2.5">$100.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Earnings Display */}
            {earnings !== null && formCompleted.time && formCompleted.rate && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  Total Hours: {calculateHours(form.getValues().startTime, form.getValues().endTime).toFixed(2)}
                </p>
                <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                  Estimated Pay: ${earnings.toFixed(2)}
                </p>
              </div>
            )}

            {completionPercentage < 100 ? (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Incomplete Form</AlertTitle>
                <AlertDescription>
                  Please complete all required fields before submitting.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Ready to Submit</AlertTitle>
                <AlertDescription>
                  All required information has been provided.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <Button 
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium h-11 disabled:opacity-50"
              disabled={isSubmitting || completionPercentage < 100}
            >
              {isSubmitting ? "Submitting..." : "Add Shift"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}