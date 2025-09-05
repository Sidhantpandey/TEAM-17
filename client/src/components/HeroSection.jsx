import { Button } from "../ui/button";
import { MessageCircle, Calendar, Heart } from "lucide-react";
import heroImage from "@/assets/hero-mental-health.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gradient-calm py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4" />
                24/7 Support Available
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Mental Health
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Matters
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive digital mental health support designed specifically for students. 
                Get AI-guided support, book confidential sessions, access resources, and connect 
                with your peers in a safe, supportive environment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-elevated transition-spring">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start AI Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spring"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Counseling
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Confidential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">For Students</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-floating">
              <img 
                src={heroImage} 
                alt="Students receiving mental health support in a peaceful campus environment" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-card shadow-elevated rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium">Counselor Available</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card shadow-elevated rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">AI Chat Active</div>
                  <div className="text-xs text-muted-foreground">Ready to help</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;