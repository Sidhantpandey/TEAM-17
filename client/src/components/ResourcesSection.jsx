import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  BookOpen, 
  Play, 
  Headphones, 
  Download, 
  Search, 
  Filter,
  Globe,
  Clock,
  Heart,
  Brain,
  Moon,
  Zap,
  Users,
  MessageCircle,
  ExternalLink
} from "lucide-react";

const ResourcesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "anxiety", name: "Anxiety", icon: Heart },
    { id: "depression", name: "Depression", icon: Brain },
    { id: "sleep", name: "Sleep", icon: Moon },
    { id: "stress", name: "Stress", icon: Zap }
  ];

  const resources = [
    {
      id: 1,
      title: "Deep Breathing for Anxiety",
      type: "video",
      duration: "8 min",
      category: "anxiety",
      language: "English",
      description: "Learn evidence-based breathing techniques to manage anxiety attacks and daily stress from WebMD's mental health experts.",
      downloads: 1250,
      rating: 4.8,
      url: "https://www.webmd.com/mental-health/video/video-anxiety-breath-exercises",
      source: "WebMD"
    },
    {
      id: 2,
      title: "Progressive Muscle Relaxation",
      type: "audio",
      duration: "15 min",
      category: "stress",
      language: "English",
      description: "Guided audio from Dartmouth Student Wellness Center to help you release physical tension and achieve deep relaxation.",
      downloads: 980,
      rating: 4.9,
      url: "https://students.dartmouth.edu/wellness-center/wellness-mindfulness/mindfulness-meditation/guided-recordings/progressive-muscle-relaxation",
      source: "Dartmouth Student Wellness"
    },
    {
      id: 3,
      title: "Sleep Hygiene Guide",
      type: "guide",
      duration: "Read 5 min",
      category: "sleep",
      language: "Multiple",
      description: "Comprehensive guide from NHS on improving sleep quality and establishing healthy sleep habits for better mental health.",
      downloads: 2100,
      rating: 4.7,
      url: "https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/",
      source: "NHS"
    },
    {
      id: 4,
      title: "Breathing Exercises for Stress",
      type: "guide",
      duration: "5 min",
      category: "stress",
      language: "English",
      description: "NHS-approved relaxation tips and calming breathing exercises to relieve stress symptoms effectively.",
      downloads: 1850,
      rating: 4.8,
      url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
      source: "NHS"
    },
    {
      id: 5,
      title: "Understanding Depression",
      type: "guide",
      duration: "Read 10 min",
      category: "depression",
      language: "Multiple",
      description: "Educational resource about depression symptoms, causes, and treatment options from mental health professionals.",
      downloads: 1650,
      rating: 4.6,
      url: "https://www.nhs.uk/mental-health/conditions/depression/overview/",
      source: "NHS"
    },
    {
      id: 6,
      title: "Meditation for Beginners",
      type: "video",
      duration: "10 min",
      category: "anxiety",
      language: "English",
      description: "NHS Every Mind Matters guide with video tutorial on how to meditate and the benefits of meditation for mental wellbeing.",
      downloads: 2200,
      rating: 4.9,
      url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/how-to-meditate-for-beginners/",
      source: "NHS Every Mind Matters"
    },
    {
      id: 7,
      title: "PMR Audio Files",
      type: "audio",
      duration: "20 min",
      category: "stress",
      language: "English",
      description: "University of Michigan's progressive muscle relaxation audio files to help control tension and relieve anxiety.",
      downloads: 1420,
      rating: 4.7,
      url: "https://mari.umich.edu/psych-clinic/pmr-audio",
      source: "University of Michigan"
    },
    {
      id: 8,
      title: "Guided Relaxation Recordings",
      type: "audio",
      duration: "5-25 min",
      category: "stress",
      language: "English",
      description: "Variety of mindfulness meditations from Western Sydney University's counselling services for stress management.",
      downloads: 1100,
      rating: 4.6,
      url: "https://www.westernsydney.edu.au/currentstudents/current_students/services_and_facilities/counselling_services/stress_and_your_wellbeing/relaxation_recordings",
      source: "Western Sydney University"
    }
  ];

  const languages = ["English", "Spanish", "French", "Mandarin", "Arabic", "Hindi"];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "video": return <Play className="w-4 h-4" />;
      case "audio": return <Headphones className="w-4 h-4" />;
      case "guide": return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video": return "bg-teal-500 text-white";
      case "audio": return "bg-teal-100 text-teal-800";
      case "guide": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleResourceAccess = (resource) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="resources" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Psychoeducational Resources
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mental Wellness Resource Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access evidence-based videos, audio guides, and educational materials 
            from trusted healthcare providers and universities to support your mental health journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search resources, topics, or techniques..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-3 text-base border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="default"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`whitespace-nowrap px-4 py-2 ${
                          selectedCategory === category.id 
                            ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-5 flex-1">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getTypeColor(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {resource.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {resource.duration}
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              {resource.language}
                            </div>
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              {resource.downloads.toLocaleString()} accesses
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500">⭐</span>
                              {resource.rating}
                            </div>
                          </div>
                          <div className="mt-3">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Source: {resource.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleResourceAccess(resource)}
                        className="shrink-0 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-16 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No resources found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or category filters to find relevant resources.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Popular This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {resources.slice(0, 3).map((resource) => (
                  <div 
                    key={resource.id} 
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleResourceAccess(resource)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        {resource.duration} • <span className="text-yellow-500">⭐</span> {resource.rating}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Trusted Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">NHS (National Health Service)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">University Medical Centers</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-800">Student Wellness Centers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Available Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((language) => (
                    <Badge key={language} variant="secondary" className="justify-center py-2 bg-gray-100 text-gray-700 hover:bg-gray-200">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardContent className="p-8 text-center">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg mb-3">Daily Wellness Tip</h4>
                <p className="text-sm opacity-95 mb-6 leading-relaxed">
                  Take 5 minutes today to practice deep breathing. Even short mindfulness breaks can significantly reduce stress levels.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => window.open('https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/', '_blank')}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Emergency Resources</h4>
                <p className="text-sm text-gray-600 mb-6">
                  If you're in crisis, reach out for immediate help. You're not alone.
                </p>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white w-full mb-3"
                  onClick={() => window.open('tel:8218128937', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Crisis Hotline: 8218128937
                </Button>
                <Button 
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() => window.open('https://www.crisistext.org/', '_blank')}
                >
                  Crisis Text Line
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;