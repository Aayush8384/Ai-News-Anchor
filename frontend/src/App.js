import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Parallax background component
const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <motion.div
      className="fixed inset-0 z-0"
      style={{ y, opacity }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-cyan-400/30 rotate-45 animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 border border-purple-400/30 -rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-teal-400/30 rotate-90 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </motion.div>
  );
};

// Animated particles component
const AnimatedParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00fff7', '#8b5cf6', '#06b6d4'];
    
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

// Futuristic navigation component
const FuturisticNav = ({ step, setStep }) => (
  <motion.nav 
    className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800"
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold text-white"
          whileHover={{ scale: 1.05 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI VIDEO
          </span>
          <span className="text-white ml-2">GENERATOR</span>
        </motion.div>
        
        <div className="flex items-center space-x-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              onClick={() => setStep(n)}
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                step === n 
                  ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {n === 1 && 'Topic'}
              {n === 2 && 'Script'}
              {n === 3 && 'Avatar'}
              {n === 4 && 'Generate'}
              {n === 5 && 'Library'}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </motion.nav>
);

// Glowing text component
const GlowingText = ({ children, className = "", glowColor = "#00fff7" }) => (
  <motion.div
    className={`relative ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div
      className="absolute inset-0 blur-lg"
      style={{
        background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
        opacity: 0.6
      }}
    />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// Futuristic button component
const FuturisticButton = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const baseClasses = "relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50",
    secondary: "bg-transparent border-2 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400",
    neon: "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Futuristic card component
const FuturisticCard = ({ children, className = "" }) => (
  <motion.div
    className={`backdrop-blur-xl bg-black/40 border border-gray-800/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 50, rotateX: 15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    whileHover={{ 
      y: -10, 
      rotateX: 5,
      boxShadow: "0 25px 50px -12px rgba(0, 255, 247, 0.25)"
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// Feature card component
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="backdrop-blur-xl bg-black/40 border border-gray-800/50 rounded-xl p-6 text-center"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="text-4xl mb-4 text-cyan-400">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

// Statistic component
const Statistic = ({ number, label, delay = 0 }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
  >
    <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{number}</div>
    <div className="text-gray-400 text-lg">{label}</div>
  </motion.div>
);

// Hero section component
const HeroSection = () => (
  <motion.section 
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
    <AnimatedParticles />
    
    <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <GlowingText className="text-6xl md:text-8xl font-black mb-6 text-white">
          AI VIDEO GENERATOR
        </GlowingText>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Revolutionize content creation with cutting-edge AI technology. Generate stunning videos 
          with advanced voice synthesis, perfect lip sync, and neural network-powered editing.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <Statistic number="99.9%" label="Accuracy" delay={0.1} />
          <Statistic number="< 2min" label="Generation Time" delay={0.2} />
          <Statistic number="4K" label="Video Quality" delay={0.3} />
          <Statistic number="50+" label="Languages" delay={0.4} />
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <FuturisticButton variant="neon" className="text-xl px-12 py-6">
            Start Creating
          </FuturisticButton>
          <FuturisticButton variant="secondary" className="text-xl px-12 py-6">
            View Examples
          </FuturisticButton>
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
);

// Features section component
const FeaturesSection = () => (
  <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Advanced AI Technology
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Powered by state-of-the-art neural networks and machine learning algorithms
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon="🎯"
          title="Smart Topic Detection"
          description="AI automatically identifies trending topics and generates relevant content suggestions"
          delay={0.1}
        />
        <FeatureCard
          icon="🎭"
          title="Perfect Lip Sync"
          description="Advanced facial recognition and synchronization technology for realistic video generation"
          delay={0.2}
        />
        <FeatureCard
          icon="🎤"
          title="Natural Voice Synthesis"
          description="Human-like voice generation with emotion and accent control"
          delay={0.3}
        />
        <FeatureCard
          icon="⚡"
          title="Lightning Fast"
          description="Optimized algorithms deliver high-quality videos in under 2 minutes"
          delay={0.4}
        />
        <FeatureCard
          icon="🎨"
          title="Custom Styling"
          description="Personalize your videos with custom themes, effects, and branding"
          delay={0.5}
        />
        <FeatureCard
          icon="🌍"
          title="Multi-Language"
          description="Support for 50+ languages with accurate pronunciation and localization"
          delay={0.6}
        />
      </div>
    </div>
  </section>
);

// How it works section
const HowItWorksSection = () => (
  <section className="py-20 relative bg-black/50">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          How It Works
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Simple 4-step process to create professional AI videos
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            step: "01",
            title: "Choose Topic",
            description: "Enter your topic or use our AI to fetch trending news automatically",
            icon: "📝"
          },
          {
            step: "02",
            title: "Generate Script",
            description: "AI creates engaging scripts with perfect grammar and flow",
            icon: "✍️"
          },
          {
            step: "03",
            title: "Upload Avatar",
            description: "Upload a 1-minute face video for perfect lip synchronization",
            icon: "👤"
          },
          {
            step: "04",
            title: "Create Video",
            description: "AI generates your final video with voice and lip sync in minutes",
            icon: "🎬"
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                {item.step}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Testimonials section
const TestimonialsSection = () => (
  <section className="py-20 relative">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          What Users Say
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Join thousands of content creators who trust our AI technology
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Sarah Chen",
            role: "Content Creator",
            avatar: "👩‍💼",
            text: "This AI video generator has revolutionized my content creation. The quality is incredible and it saves me hours of work!"
          },
          {
            name: "Marcus Rodriguez",
            role: "Marketing Director",
            avatar: "👨‍💼",
            text: "Perfect for our marketing campaigns. The lip sync technology is so realistic, our audience can't tell it's AI-generated."
          },
          {
            name: "Emma Thompson",
            role: "YouTuber",
            avatar: "👩‍🎤",
            text: "I've tried many AI tools, but this one is by far the best. The voice synthesis sounds completely natural."
          }
        ].map((testimonial, index) => (
          <motion.div
            key={index}
            className="backdrop-blur-xl bg-black/40 border border-gray-800/50 rounded-xl p-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-4xl mb-4">{testimonial.avatar}</div>
            <p className="text-gray-300 mb-4 leading-relaxed">"{testimonial.text}"</p>
            <div>
              <div className="font-bold text-white">{testimonial.name}</div>
              <div className="text-cyan-400">{testimonial.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default function App() {
  // State
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState([]);
  const [script, setScript] = useState("");
  const [autoProceed, setAutoProceed] = useState(true);
  const [step, setStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [voicePath, setVoicePath] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef();

  // Fetch topics from backend
  const fetchTopics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/fetch-topic`);
      const data = await res.json();
      setTopics(data.topics || []);
      if (data.topics && data.topics.length > 0) {
        setTopic(data.topics[0].title || data.topics[0]);
        setDescription(data.topics[0].description || "");
      }
    } catch (e) {
      setError("Failed to fetch topics");
    }
    setLoading(false);
  };

  // Generate script
  const generateScript = async () => {
    setLoading(true);
    setError("");
    setProgress("Generating script...");
    try {
      const form = new FormData();
      form.append("title", topic);
      form.append("description", description);
      const res = await fetch(`${API}/generate-script`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setScript(data.script || "");
      setProgress("");
      if (autoProceed) {
        setTimeout(() => setStep(3), 500);
      }
    } catch (e) {
      setError("Failed to generate script");
      setProgress("");
    }
    setLoading(false);
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    setLoading(true);
    setError("");
    setProgress("Uploading avatar...");
    try {
      const form = new FormData();
      form.append("file", file);
      await fetch(`${API}/upload-avatar`, {
        method: "POST",
        body: form,
      });
      setProgress("");
      if (autoProceed) {
        setTimeout(() => setStep(4), 500);
      }
    } catch (e) {
      setError("Failed to upload avatar");
      setProgress("");
    }
    setLoading(false);
  };

  // Generate voiceover
  const generateVoiceover = async () => {
    setLoading(true);
    setError("");
    setProgress("Generating voiceover...");
    try {
      const form = new FormData();
      form.append("script", script);
      const res = await fetch(`${API}/generate-voiceover`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setVoicePath(data.audio);
      setProgress("");
      if (autoProceed) {
        setTimeout(() => generateVideo(data.audio), 500);
      }
    } catch (e) {
      setError("Failed to generate voiceover");
      setProgress("");
    }
    setLoading(false);
  };

  // Generate video
  const generateVideo = async (audio = voicePath) => {
    setLoading(true);
    setError("");
    setProgress("Generating video...");
    try {
      const form = new FormData();
      form.append("audio_path", audio);
      const res = await fetch(`${API}/generate-video`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setVideoPath(data.video);
      setProgress("");
      setTimeout(() => fetchSavedVideos(), 1000);
    } catch (e) {
      setError("Failed to generate video");
      setProgress("");
    }
    setLoading(false);
  };

  // Fetch saved videos
  const fetchSavedVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/saved-videos`);
      const data = await res.json();
      setSavedVideos(data.videos || []);
    } catch (e) {
      setError("Failed to fetch saved videos");
    }
    setLoading(false);
  };

  // Handle avatar file select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Handle avatar upload submit
  const handleAvatarUpload = (e) => {
    e.preventDefault();
    if (avatarFile) {
      uploadAvatar(avatarFile);
    }
  };

  // On mount, fetch saved videos
  React.useEffect(() => {
    fetchSavedVideos();
  }, []);

  // UI Steps
  return (
    <div className="min-h-screen font-poppins relative overflow-hidden bg-black">
      <ParallaxBackground />
      <FuturisticNav step={step} setStep={setStep} />
      
      {/* Hero Section */}
      {step === 1 && (
        <>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
        </>
      )}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 pt-32">
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Content Area */}
          <AnimatePresence mode="wait">
            {/* Step 1: Topic Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <FuturisticCard className="mb-8">
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-white text-2xl font-bold mb-6">Enter Topic</label>
                    <input
                      className="w-full p-6 rounded-xl bg-gray-900/80 border border-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="Type a news topic..."
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FuturisticButton
                      onClick={fetchTopics}
                      disabled={loading}
                      variant="neon"
                    >
                      {loading ? "Fetching..." : "Auto Fetch"}
                    </FuturisticButton>
                    <FuturisticButton
                      onClick={() => setStep(2)}
                      disabled={!topic}
                      variant="secondary"
                    >
                      Next
                    </FuturisticButton>
                  </motion.div>

                  {topics.length > 0 && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-gray-400 mb-4 text-lg">Or select:</label>
                      <select
                        className="w-full p-4 rounded-xl bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 backdrop-blur-sm"
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          setTopic(topics[idx].title || topics[idx]);
                          setDescription(topics[idx].description || "");
                        }}
                      >
                        {topics.map((t, i) => (
                          <option key={i} value={t.title || t}>{t.title || t}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </FuturisticCard>
              </motion.div>
            )}

            {/* Step 2: Script Generator */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <FuturisticCard className="mb-8">
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-white text-2xl font-bold mb-6">Generated Script</label>
                    <textarea
                      className="w-full min-h-[300px] p-6 rounded-xl bg-gray-900/80 border border-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 placeholder-gray-500 resize-none backdrop-blur-sm"
                      value={script}
                      onChange={e => setScript(e.target.value)}
                      placeholder="Script will appear here..."
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-gray-400 flex items-center gap-4 text-lg">
                      <input
                        type="checkbox"
                        checked={autoProceed}
                        onChange={e => setAutoProceed(e.target.checked)}
                        className="w-6 h-6 accent-cyan-400"
                      />
                      Auto Proceed
                    </label>
                    <FuturisticButton
                      onClick={generateScript}
                      disabled={loading || !topic}
                      variant="neon"
                    >
                      {loading ? "Generating..." : "Generate Script"}
                    </FuturisticButton>
                    {!autoProceed && (
                      <FuturisticButton
                        onClick={() => setStep(3)}
                        disabled={!script}
                        variant="secondary"
                      >
                        Next
                      </FuturisticButton>
                    )}
                  </motion.div>
                </FuturisticCard>
              </motion.div>
            )}

            {/* Step 3: Avatar Upload */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <FuturisticCard className="mb-8">
                  <form onSubmit={handleAvatarUpload}>
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-white text-2xl font-bold mb-6">Upload 1-min Face Video (mp4)</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/mp4"
                          className="block w-full text-white file:mr-4 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-lg file:font-bold file:bg-gray-800 file:text-cyan-400 hover:file:bg-gray-700 transition-all duration-300"
                          onChange={handleAvatarChange}
                          ref={fileInputRef}
                        />
                      </div>
                      {avatarPreview && (
                        <motion.video 
                          src={avatarPreview} 
                          controls 
                          className="mt-8 rounded-xl w-full max-h-80 border border-gray-600 shadow-lg backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FuturisticButton
                        type="submit"
                        disabled={loading || !avatarFile}
                        variant="neon"
                        className="w-full"
                      >
                        {loading ? "Uploading..." : "Upload & Next"}
                      </FuturisticButton>
                    </motion.div>
                  </form>
                  
                  {!autoProceed && (
                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <FuturisticButton
                        onClick={() => setStep(4)}
                        disabled={!avatarFile}
                        variant="secondary"
                        className="w-full"
                      >
                        Next
                      </FuturisticButton>
                    </motion.div>
                  )}
                </FuturisticCard>
              </motion.div>
            )}

            {/* Step 4: Final Output Section */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <FuturisticCard className="mb-8">
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FuturisticButton
                      onClick={generateVoiceover}
                      disabled={loading || !script}
                      variant="neon"
                      className="w-full mb-6"
                    >
                      {loading ? "Processing..." : "Generate Video"}
                    </FuturisticButton>
                    
                    {progress && (
                      <motion.div 
                        className="text-cyan-400 mb-6 text-center text-xl animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {progress}
                      </motion.div>
                    )}
                    
                    {videoPath && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <video 
                          src={videoPath.startsWith("output/") ? `/${videoPath}` : videoPath} 
                          controls 
                          className="rounded-xl w-full max-h-96 border border-gray-600 shadow-lg mb-6 backdrop-blur-sm" 
                        />
                        <a
                          href={`${API}/download-video?file=${encodeURIComponent(videoPath.replace('output/', ''))}`}
                          className="block w-full"
                          download
                        >
                          <FuturisticButton
                            variant="neon"
                            className="w-full"
                          >
                            Download Video
                          </FuturisticButton>
                        </a>
                      </motion.div>
                    )}
                  </motion.div>
                </FuturisticCard>
              </motion.div>
            )}

            {/* Step 5: Saved Videos */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <FuturisticCard>
                  <motion.h2 
                    className="text-4xl font-bold text-cyan-400 mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Video Library
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedVideos.map((vid, i) => (
                      <motion.div 
                        key={i} 
                        className="backdrop-blur-xl bg-gray-900/50 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <video 
                          src={`output/${vid.file}`} 
                          controls 
                          className="rounded-lg w-full max-h-48 border border-gray-600 mb-4" 
                        />
                        <div className="text-white font-semibold truncate mb-3">{vid.title}</div>
                        <div className="text-gray-400 text-sm mb-4">{new Date(vid.date * 1000).toLocaleString()}</div>
                        <a
                          href={`${API}/download-video?file=${encodeURIComponent(vid.file)}`}
                          className="block w-full"
                          download
                        >
                          <FuturisticButton
                            variant="secondary"
                            className="w-full"
                          >
                            Download
                          </FuturisticButton>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </FuturisticCard>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              className="text-red-400 mt-8 text-center text-lg bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="text-gray-500 text-sm mt-16 text-center w-full relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="bg-gradient-to-r from-transparent via-gray-800/20 to-transparent py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-2xl font-bold text-white mb-4 md:mb-0">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  AI VIDEO GENERATOR
                </span>
              </div>
              <div className="text-gray-400">
                &copy; {new Date().getFullYear()} - Powered by Advanced AI Technology
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
