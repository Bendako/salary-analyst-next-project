"use client"

import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Clock, Building, Briefcase, DollarSign } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

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

const AddShiftWorkForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnings, setEarnings] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workType: "",
      location: "",
      startTime: "",
      endTime: "",
      hourlyRate: "",
    },
  });

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    
    const startMinutesTotal = startHours * 60 + startMinutes;
    const endMinutesTotal = endHours * 60 + endMinutes;
    
    const diffMinutes = endMinutesTotal - startMinutesTotal;
    return diffMinutes > 0 ? diffMinutes / 60 : 0;
  };

  const calculateEarnings = () => {
    const values = form.getValues();
    const hours = calculateHours(values.startTime, values.endTime);
    const rate = parseFloat(values.hourlyRate) || 0;
    const totalEarnings = hours * rate;
    setEarnings(totalEarnings);
    return totalEarnings;
  };

  const handleTimeChange = () => {
    calculateEarnings();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Calculate final earnings
    const finalEarnings = calculateEarnings();
    
    // Log the values for now - would be replaced with API call
    console.log({
      ...values,
      hours: calculateHours(values.startTime, values.endTime),
      earnings: finalEarnings,
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    // Here you'd navigate or show success
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-500 dark:bg-blue-600 text-white">
        <CardTitle className="text-2xl font-bold text-center">Add Shift</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-medium">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Type */}
            <FormField
              control={form.control}
              name="workType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Work Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select work type" />
                        <Briefcase className="ml-auto h-4 w-4" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="school shift">School Shift</SelectItem>
                      <SelectItem value="english lesson">English Lesson</SelectItem>
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
                <FormItem>
                  <FormLabel className="font-medium">Location / Institution</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="School/Institution name" 
                        {...field} 
                        className="pl-10"
                      />
                      <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Start Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="time" 
                          {...field} 
                          className="pl-10"
                          onChange={(e) => {
                            field.onChange(e);
                            handleTimeChange();
                          }}
                        />
                        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                    <FormLabel className="font-medium">End Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="time" 
                          {...field} 
                          className="pl-10"
                          onChange={(e) => {
                            field.onChange(e);
                            handleTimeChange();
                          }}
                        />
                        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hourly Rate */}
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Hourly Rate</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeout(calculateEarnings, 0);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hourly rate" />
                        <DollarSign className="ml-auto h-4 w-4" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="32.31">$32.31</SelectItem>
                      <SelectItem value="37.16">$37.16</SelectItem>
                      <SelectItem value="80">$80.00</SelectItem>
                      <SelectItem value="100">$100.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Earnings Display */}
            {earnings !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-lg font-semibold">
                  Total Hours: {calculateHours(form.getValues().startTime, form.getValues().endTime).toFixed(2)}
                </p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Estimated Pay: ${earnings.toFixed(2)}
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add Shift"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddShiftWorkForm;