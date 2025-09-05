import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Calendar, Clock, User, Shield, Phone, MessageSquare, Video, Heart, Star, CheckCircle, AlertCircle, MapPin } from "lucide-react";

const BookingSection = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [counselorType, setCounselorType] = useState("");
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [shortNote, setShortNote] = useState("");

  const counselors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialization: "Anxiety & Depression",
      experience: "8 years",
      rating: 4.9,
      reviews: 127,
      availability: "Available Today",
      type: "In-Person",
      location: "Student Wellness Center - Room 205",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      specialties: ["Anxiety", "Depression", "Academic Stress"],
      languages: ["English", "Mandarin"],
      nextAvailable: "Today at 2:00 PM"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      specialization: "Academic Stress & ADHD",
      experience: "6 years", 
      rating: 4.8,
      reviews: 94,
      availability: "Next Slot: 2:30 PM",
      type: "Virtual",
      location: "Online Sessions via Secure Platform",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      specialties: ["ADHD", "Academic Performance", "Time Management"],
      languages: ["English", "Spanish"],
      nextAvailable: "Today at 2:30 PM"
    },
    {
      id: 3,
      name: "Dr. Emily Johnson",
      specialization: "Relationships & Social Anxiety",
      experience: "10 years",
      rating: 4.9,
      reviews: 156,
      availability: "Available Tomorrow",
      type: "Both",
      location: "Flexible - Campus or Online",
      image: "https://images.unsplash.com/photo-1594824388862-a62d36309d72?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face",
      specialties: ["Social Anxiety", "Relationships", "Self-Esteem"],
      languages: ["English", "French"],
      nextAvailable: "Tomorrow at 10:00 AM"
    }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleCounselorSelect = (counselor) => {
    setSelectedCounselor(counselor);
    setCounselorType(counselor.type.toLowerCase() === "both" ? "in-person" : counselor.type.toLowerCase());
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-teal-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            100% Confidential & Secure
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Book Your <span className="text-teal-600">Counseling Session</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards better mental health. Our licensed counselors are here to support you in a safe, confidential environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  Schedule Your Confidential Session
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" className="border-gray-200 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" className="border-gray-200 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Student Email</Label>
                    <Input id="email" type="email" placeholder="your.email@university.edu" className="border-gray-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Session Type</Label>
                      <Select value={counselorType} onValueChange={setCounselorType}>
                        <SelectTrigger className="border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                          <SelectValue placeholder="Choose session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              In-Person (Campus)
                            </div>
                          </SelectItem>
                          <SelectItem value="virtual">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Virtual (Online)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Preferred Date</Label>
                      <Input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Available Time Slots</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={selectedTime === time 
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-600" 
                            : "border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                          }
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Counselor Display */}
                {selectedCounselor && (
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Selected Counselor</Label>
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={selectedCounselor.image} 
                          alt={selectedCounselor.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{selectedCounselor.name}</h4>
                          <p className="text-sm text-teal-700 mb-1">{selectedCounselor.specialization}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              {selectedCounselor.rating}
                            </span>
                            <span>{selectedCounselor.experience}</span>
                            <span className="text-teal-600 font-medium">{selectedCounselor.nextAvailable}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedCounselor(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Short Note Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                    <Label htmlFor="shortNote" className="text-gray-700 font-medium">Brief Note (Optional)</Label>
                  </div>
                  <Textarea 
                    id="shortNote"
                    placeholder="Briefly describe what you'd like to discuss or any specific concerns you have. This helps your counselor prepare for the session."
                    value={shortNote}
                    onChange={(e) => setShortNote(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>This information is completely confidential</span>
                    <span>{shortNote.length}/500</span>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Your Privacy is Protected</h4>
                      <div className="text-sm text-green-800 space-y-1">
                        <p>✓ All sessions are completely confidential and HIPAA compliant</p>
                        <p>✓ Your information will never be shared without your explicit consent</p>
                        <p>✓ Secure, encrypted platform for all communications</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={!selectedDate || !selectedTime || !counselorType}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Confidential Session
                  {selectedDate && selectedTime && (
                    <span className="ml-2 text-sm opacity-90">
                      • {selectedDate} at {selectedTime}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available Counselors & Crisis Support */}
          <div className="space-y-6">
            {/* Available Counselors */}
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5" />
                  Our Counselors
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {counselors.map((counselor) => (
                  <div 
                    key={counselor.id} 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCounselor?.id === counselor.id 
                        ? 'border-teal-500 bg-teal-50 shadow-md' 
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleCounselorSelect(counselor)}
                  >
                    <div className="flex gap-3">
                      <img 
                        src={counselor.image} 
                        alt={counselor.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 truncate">{counselor.name}</h4>
                            <p className="text-sm text-teal-600 font-medium">{counselor.specialization}</p>
                          </div>
                          {selectedCounselor?.id === counselor.id && (
                            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {counselor.rating}
                            </Badge>
                            <span className="text-xs text-gray-600">{counselor.reviews} reviews</span>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-teal-500" />
                              {counselor.experience} experience
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-green-500" />
                              <span className="text-green-600 font-medium">{counselor.nextAvailable}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {counselor.type === "Virtual" ? <Video className="w-3 h-3 text-blue-500" /> : 
                               counselor.type === "Both" ? <MessageSquare className="w-3 h-3 text-purple-500" /> : 
                               <MapPin className="w-3 h-3 text-orange-500" />}
                              <span className="truncate">{counselor.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {counselor.specialties.slice(0, 2).map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs px-2 py-0 border-teal-200 text-teal-700">
                                {specialty}
                              </Badge>
                            ))}
                            {counselor.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-0 border-gray-200 text-gray-600">
                                +{counselor.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <Card className="shadow-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-red-800 mb-2 text-lg">Need Immediate Help?</h4>
                  <p className="text-sm text-red-700 mb-6 leading-relaxed">
                    If you're in crisis or having thoughts of self-harm, immediate support is available 24/7.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="destructive" 
                      className="w-full bg-red-600 hover:bg-red-700 font-semibold"
                      onClick={() => window.open('tel:988', '_self')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Crisis Hotline: 988
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text Crisis Support
                    </Button>
                    <div className="text-xs text-red-600 mt-2">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Free, confidential, available 24/7
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;