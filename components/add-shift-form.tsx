"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, Building2, Coins, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "./ui/input"

interface AddShiftFormProps {
  onClose: () => void
}

export default function AddShiftForm({ onClose }: AddShiftFormProps) {
  const [shiftData, setShiftData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    hourlyRate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShiftData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shift Data:", shiftData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <Card className="max-w-md mx-auto mt-8 p-6 relative">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <h1 className="text-2xl font-bold mb-6">Add New Shift</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="relative">
              <Input
                type="date"
                name="date"
                value={shiftData.date}
                onChange={handleInputChange}
                className="pr-10"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start Time</Label>
            <div className="relative">
              <Input
                type="time"
                name="startTime"
                value={shiftData.startTime}
                onChange={handleInputChange}
                className="pr-10"
                required
              />
              <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Time</Label>
            <div className="relative">
              <Input
                type="time"
                name="endTime"
                value={shiftData.endTime}
                onChange={handleInputChange}
                className="pr-10"
                required
              />
              <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="relative">
              <Input
                type="text"
                name="location"
                value={shiftData.location}
                onChange={handleInputChange}
                className="pr-10"
                placeholder="Enter location"
                required
              />
              <Building2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hourly Rate</Label>
            <div className="relative">
              <Input
                type="number"
                name="hourlyRate"
                value={shiftData.hourlyRate}
                onChange={handleInputChange}
                className="pr-10"
                placeholder="Enter rate"
                required
              />
              <Coins className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#29b6f6] hover:bg-[#0288d1] text-white text-lg h-12">
            Add Shift
          </Button>
        </form>
      </Card>
    </div>
  )
}

