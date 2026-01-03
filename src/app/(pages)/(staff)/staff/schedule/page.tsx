"use client";

import React, { useState, useEffect } from 'react';
import Layout from "@components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Calendar as CalendarIcon, Clock, Settings, Save, X, ChevronLeft, ChevronRight, Edit, CheckSquare, Square, Layers } from "lucide-react";
import { useAuth } from "@/(pages)/(auth)/context/AuthContext";
import { 
  fetchStaffAvailabilities, 
  updateStaffAvailability, 
  updateStaffWorkHours,
  fetchStaffWorkHours 
} from "../../../(business)/actions/backend";

interface Availability {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  userEdited: boolean;
  staffId: number;
}

interface WorkHours {
  defaultStartTime: string;
  defaultEndTime: string;
}

export default function StaffSchedulePage() {
  const { user, token } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkHours, setLoadingWorkHours] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workHours, setWorkHours] = useState<WorkHours>({
    defaultStartTime: "",
    defaultEndTime: ""
  });
  const [editingWorkHours, setEditingWorkHours] = useState(false);
  const [tempWorkHours, setTempWorkHours] = useState<WorkHours>(workHours);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    startTime: "",
    endTime: "",
    status: "AVAILABLE"
  });
  
  // Bulk editing state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
  const [bulkTimeDialogOpen, setBulkTimeDialogOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    status: "AVAILABLE",
    startTime: "",
    endTime: ""
  });

  // Get first and last day of current month
  const getMonthRange = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Format dates in local timezone to avoid timezone conversion issues
    const formatLocalDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      from: formatLocalDate(firstDay),
      to: formatLocalDate(lastDay)
    };
  };

  useEffect(() => {
    if (user?.id) {
      loadWorkHours();
      loadAvailabilities();
    }
  }, [user?.id, currentDate]);

  const loadWorkHours = async () => {
    if (!user?.id) return;
    setLoadingWorkHours(true);
    try {
      const hours = await fetchStaffWorkHours(user.id, token || undefined);
      console.log('[Schedule] Work hours loaded:', hours);
      if (hours && hours.defaultStartTime && hours.defaultEndTime) {
        // Format times to HH:mm if they come as HH:mm:ss
        const formattedHours = {
          defaultStartTime: hours.defaultStartTime.substring(0, 5),
          defaultEndTime: hours.defaultEndTime.substring(0, 5)
        };
        setWorkHours(formattedHours);
        setTempWorkHours(formattedHours);
      } else {
        // If no work hours set, keep showing the empty values
        console.warn('[Schedule] No work hours set for staff');
      }
    } catch (error) {
      console.error('Failed to load work hours:', error);
    } finally {
      setLoadingWorkHours(false);
    }
  };

  const loadAvailabilities = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { from, to } = getMonthRange(currentDate);
      console.log('[Schedule] Loading availabilities for:', from, 'to', to);
      const data = await fetchStaffAvailabilities(user.id, from, to, token || undefined);
      console.log('[Schedule] Availabilities loaded:', data);
      setAvailabilities(data);
    } catch (error) {
      console.error('Failed to load availabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkHours = async () => {
    if (!user?.id) return;
    
    // Validation: BOTH times must be provided
    if (!tempWorkHours.defaultStartTime || !tempWorkHours.defaultEndTime) {
      alert('Both start time and end time are required. Please fill in both fields.');
      return;
    }
    
    // Validate that start time is before end time
    if (tempWorkHours.defaultStartTime >= tempWorkHours.defaultEndTime) {
      alert('Start time must be before end time.');
      return;
    }
    
    try {
      await updateStaffWorkHours(
        user.id,
        tempWorkHours.defaultStartTime,
        tempWorkHours.defaultEndTime,
        token || undefined
      );
      setWorkHours(tempWorkHours);
      setEditingWorkHours(false);
      // Reload availabilities since they might have been auto-generated
      await loadAvailabilities();
    } catch (error) {
      console.error('Failed to update work hours:', error);
      alert('Failed to update work hours');
    }
  };

  const handleEditAvailability = (availability: Availability) => {
    setSelectedAvailability(availability);
    setEditForm({
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: availability.status
    });
    setEditDialogOpen(true);
  };

  const handleSaveAvailability = async () => {
    if (!selectedAvailability || !user?.id) return;
    try {
      await updateStaffAvailability(
        user.id,
        selectedAvailability.id,
        {
          startTime: editForm.startTime,
          endTime: editForm.endTime,
          status: editForm.status
        },
        token || undefined
      );
      setEditDialogOpen(false);
      await loadAvailabilities();
    } catch (error) {
      console.error('Failed to update availability:', error);
      alert('Failed to update availability');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Bulk editing handlers
  const toggleBulkEditMode = () => {
    setBulkEditMode(!bulkEditMode);
    setSelectedDates(new Set());
  };

  const toggleDateSelection = (dateStr: string) => {
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const selectAllVisibleDates = () => {
    const days = getDaysInMonth();
    const allDates = new Set<string>();
    days.forEach(date => {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        allDates.add(`${year}-${month}-${day}`);
      }
    });
    setSelectedDates(allDates);
  };

  const clearSelection = () => {
    setSelectedDates(new Set());
  };

  const handleBulkStatusChange = async () => {
    if (selectedDates.size === 0 || !user?.id) return;
    
    try {
      // Update each selected date
      const updates = Array.from(selectedDates).map(async (dateStr) => {
        const avail = availabilities.find(a => a.date === dateStr);
        if (avail) {
          return updateStaffAvailability(
            user.id.toString(),
            avail.id,
            { status: bulkForm.status },
            token || undefined
          );
        }
      });
      
      await Promise.all(updates);
      setBulkStatusDialogOpen(false);
      await loadAvailabilities();
      setSelectedDates(new Set());
    } catch (error) {
      console.error('Failed to bulk update status:', error);
      alert('Failed to update status for some dates');
    }
  };

  const handleBulkTimeChange = async () => {
    if (selectedDates.size === 0 || !user?.id) return;
    
    try {
      // Update each selected date
      const updates = Array.from(selectedDates).map(async (dateStr) => {
        const avail = availabilities.find(a => a.date === dateStr);
        if (avail) {
          return updateStaffAvailability(
            user.id.toString(),
            avail.id,
            {
              startTime: bulkForm.startTime,
              endTime: bulkForm.endTime
            },
            token || undefined
          );
        }
      });
      
      await Promise.all(updates);
      setBulkTimeDialogOpen(false);
      await loadAvailabilities();
      setSelectedDates(new Set());
    } catch (error) {
      console.error('Failed to bulk update times:', error);
      alert('Failed to update times for some dates');
    }
  };

  const getAvailabilitiesForDate = (date: Date) => {
    // Format date in local timezone to avoid timezone conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return availabilities.filter(a => a.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'FULL':
        return 'bg-orange-100 text-orange-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'SICK':
        return 'bg-pink-100 text-pink-800';
      case 'VACATION':
        return 'bg-blue-100 text-blue-800';
      case 'DAY_OFF':
        return 'bg-purple-100 text-purple-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading && availabilities.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-staff mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading schedule...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-600 mt-1">Manage your availability and work hours</p>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calendar">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{monthName}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={bulkEditMode ? "default" : "outline"}
                      size="sm"
                      onClick={toggleBulkEditMode}
                      className={bulkEditMode ? "bg-staff hover:bg-staff-dark text-white" : ""}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      {bulkEditMode ? "Exit Bulk Edit" : "Bulk Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Bulk Action Toolbar */}
                {bulkEditMode && (
                  <div className="mb-4 p-3 bg-purple-50 border border-staff rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {selectedDates.size} date{selectedDates.size !== 1 ? 's' : ''} selected
                        </span>
                        {selectedDates.size > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="text-xs"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllVisibleDates}
                        >
                          Select All
                        </Button>
                        {selectedDates.size > 0 && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => {
                                setBulkForm({ ...bulkForm, status: 'AVAILABLE' });
                                setBulkStatusDialogOpen(true);
                              }}
                              className="bg-staff hover:bg-staff-dark text-white"
                            >
                              Change Status
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setBulkForm({ ...bulkForm, startTime: workHours.defaultStartTime, endTime: workHours.defaultEndTime });
                                setBulkTimeDialogOpen(true);
                              }}
                              className="bg-staff hover:bg-staff-dark text-white"
                            >
                              Change Times
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Week day headers */}
                  {weekDays.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {getDaysInMonth().map((date, index) => {
                    if (!date) {
                      return <div key={`empty-cell-${Math.random()}-${index}`} className="p-2"></div>;
                    }

                    const dayAvailabilities = getAvailabilitiesForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                    
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    const isSelected = selectedDates.has(dateStr);

                    return (
                      <div
                        key={date.toISOString()}
                        className={`min-h-24 p-2 border rounded-lg ${
                          isToday ? 'border-staff border-2 bg-purple-50' : 'border-gray-200'
                        } ${isPast ? 'bg-gray-50 opacity-60' : 'bg-white'} ${
                          isSelected ? 'ring-2 ring-staff bg-purple-50' : ''
                        } hover:shadow-md transition-shadow relative`}
                      >
                        {/* Bulk edit checkbox */}
                        {bulkEditMode && !isPast && (
                          <div
                            className="absolute top-1 right-1 cursor-pointer"
                            onClick={() => toggleDateSelection(dateStr)}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-staff" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 hover:text-staff" />
                            )}
                          </div>
                        )}
                        
                        <div className="text-sm font-semibold mb-1 dark:text-black">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayAvailabilities.map(avail => (
                            <button
                              key={avail.id}
                              onClick={() => !isPast && !bulkEditMode && handleEditAvailability(avail)}
                              className={`w-full text-xs p-1 rounded ${getStatusColor(avail.status)} hover:opacity-80 transition-opacity text-left ${
                                bulkEditMode ? 'cursor-default' : ''
                              }`}
                              disabled={isPast || bulkEditMode}
                            >
                              <div className="flex items-center justify-between">
                                <span>{avail.startTime.substring(0, 5)}</span>
                                {avail.userEdited && (
                                  <Edit className="w-3 h-3" />
                                )}
                              </div>
                              <div className="text-xs opacity-75">
                                {avail.endTime.substring(0, 5)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100"></div>
                    <span className="text-xs text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-100"></div>
                    <span className="text-xs text-gray-600">Full</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100"></div>
                    <span className="text-xs text-gray-600">Closed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-pink-100"></div>
                    <span className="text-xs text-gray-600">Sick</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100"></div>
                    <span className="text-xs text-gray-600">Vacation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-100"></div>
                    <span className="text-xs text-gray-600">Day Off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100"></div>
                    <span className="text-xs text-gray-600">Unavailable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600">User Edited</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Default Work Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Set your default working hours. These will be used to generate your availability schedule.
                </p>

                {loadingWorkHours ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-staff"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <div className="flex gap-2">
                        <Input
                          id="startTime"
                          type="time"
                          value={editingWorkHours ? tempWorkHours.defaultStartTime : workHours.defaultStartTime}
                          onChange={(e) => editingWorkHours && setTempWorkHours({ ...tempWorkHours, defaultStartTime: e.target.value })}
                          disabled={!editingWorkHours}
                          placeholder="--:--"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <div className="flex gap-2">
                        <Input
                          id="endTime"
                          type="time"
                          value={editingWorkHours ? tempWorkHours.defaultEndTime : workHours.defaultEndTime}
                          onChange={(e) => editingWorkHours && setTempWorkHours({ ...tempWorkHours, defaultEndTime: e.target.value })}
                          disabled={!editingWorkHours}
                          placeholder="--:--"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingWorkHours ? (
                    <>
                      <Button
                        className="bg-staff hover:bg-staff-dark text-white"
                        onClick={handleSaveWorkHours}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempWorkHours(workHours);
                          setEditingWorkHours(false);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-staff hover:bg-staff-dark text-white"
                      onClick={() => setEditingWorkHours(true)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Edit Work Hours
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">• Your availability schedule is automatically generated based on your default work hours</p>
                  <p className="mb-2">• Click on any future availability slot in the calendar to edit it</p>
                  <p className="mb-2">• You can change the status (Available, Busy, Unavailable) or adjust the time</p>
                  <p>• Changes are marked with an edit icon and override the auto-generated schedule</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Availability Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Availability</DialogTitle>
              <DialogDescription>
                Update your availability for {selectedAvailability?.date}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Start Time</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endTime">End Time</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={editForm.endTime}
                  onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="FULL">Full (All Booked)</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="VACATION">Vacation</SelectItem>
                    <SelectItem value="DAY_OFF">Day Off</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-staff hover:bg-staff-dark text-white" onClick={handleSaveAvailability}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Status Change Dialog */}
        <Dialog open={bulkStatusDialogOpen} onOpenChange={setBulkStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Status for Multiple Dates</DialogTitle>
              <DialogDescription>
                Update status for {selectedDates.size} selected date{selectedDates.size !== 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-status">New Status</Label>
                <Select
                  value={bulkForm.status}
                  onValueChange={(value) => setBulkForm({ ...bulkForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="FULL">Full (All Booked)</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="VACATION">Vacation</SelectItem>
                    <SelectItem value="DAY_OFF">Day Off</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-gray-500">
                This will update the status for all {selectedDates.size} selected dates.
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-staff hover:bg-staff-dark text-white" onClick={handleBulkStatusChange}>
                Update All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Time Change Dialog */}
        <Dialog open={bulkTimeDialogOpen} onOpenChange={setBulkTimeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Times for Multiple Dates</DialogTitle>
              <DialogDescription>
                Update working times for {selectedDates.size} selected date{selectedDates.size !== 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-startTime">Start Time</Label>
                <Input
                  id="bulk-startTime"
                  type="time"
                  value={bulkForm.startTime}
                  onChange={(e) => setBulkForm({ ...bulkForm, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-endTime">End Time</Label>
                <Input
                  id="bulk-endTime"
                  type="time"
                  value={bulkForm.endTime}
                  onChange={(e) => setBulkForm({ ...bulkForm, endTime: e.target.value })}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                This will update the working times for all {selectedDates.size} selected dates.
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkTimeDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-staff hover:bg-staff-dark text-white" onClick={handleBulkTimeChange}>
                Update All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
