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
  MessageCircle
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
      description: "Learn evidence-based breathing techniques to manage anxiety attacks and daily stress.",
      downloads: 1250,
      rating: 4.8
    },
    {
      id: 2,
      title: "Progressive Muscle Relaxation",
      type: "audio",
      duration: "15 min",
      category: "stress",
      language: "English",
      description: "Guided audio to help you release physical tension and achieve deep relaxation.",
      downloads: 980,
      rating: 4.9
    },
    {
      id: 3,
      title: "Sleep Hygiene Guide",
      type: "guide",
      duration: "Read 5 min",
      category: "sleep",
      language: "Multiple",
      description: "Comprehensive guide to improving sleep quality and establishing healthy sleep habits.",
      downloads: 2100,
      rating: 4.7
    },
    {
      id: 4,
      title: "Mindful Study Techniques",
      type: "video",
      duration: "12 min",
      category: "stress",
      language: "English",
      description: "Learn how to study more effectively while maintaining mental wellbeing.",
      downloads: 1850,
      rating: 4.8
    },
    {
      id: 5,
      title: "Understanding Depression",
      type: "guide",
      duration: "Read 10 min",
      category: "depression",
      language: "Multiple",
      description: "Educational resource about depression symptoms, causes, and treatment options.",
      downloads: 1650,
      rating: 4.6
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
            in multiple languages to support your mental health journey.
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
                          <div className="flex items-center gap-6 text-sm text-gray-500">
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
                              {resource.downloads.toLocaleString()} downloads
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500">⭐</span>
                              {resource.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="shrink-0 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2">
                        <Play className="w-4 h-4 mr-2" />
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
                  <div key={resource.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
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
                  </div>
                ))}
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
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Students Supporting Students</h4>
                <p className="text-sm text-gray-600 mb-6">
                  Connect with peer support groups and share your wellness journey with fellow students.
                </p>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Community
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