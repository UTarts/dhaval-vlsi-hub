import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Code2, MapPin, Mail } from "lucide-react";
import SEO from "@/components/shared/SEO";
import { Helmet } from "react-helmet-async"; 

export default function About() {
  const experiences = [
    {
      title: "Physical Design Lead Engineer",
      company: "Quest Global",
      location: "Bangalore, India",
      period: "2020 - Present",
      description: "Leading physical design implementation for AI accelerator chips in 5nm and 7nm FinFET technologies. Managing tape-out schedules and mentoring junior engineers.",
    },
    {
      title: "Senior Physical Design Engineer",
      company: "Semiconductor Corp",
      location: "Bangalore, India",
      period: "2017 - 2020",
      description: "Performed floorplanning, placement, CTS, and routing for multi-million gate SoCs. Achieved timing closure on critical paths with innovative optimization techniques.",
    },
    {
      title: "Physical Design Engineer",
      company: "Tech Solutions",
      location: "Pune, India",
      period: "2015 - 2017",
      description: "Worked on backend implementation flows using Synopsys ICC2 and Cadence Innovus. Developed automation scripts for repetitive tasks.",
    },
  ];

  const skills = [
    { category: "EDA Tools", items: ["Synopsys ICC2", "Cadence Innovus", "PrimeTime", "Design Compiler", "Calibre"] },
    { category: "Technologies", items: ["5nm/7nm FinFET", "Multi-VDD", "Low Power Design", "Clock Tree Synthesis", "DRC/LVS"] },
    { category: "Scripting", items: ["TCL", "Python", "Shell", "Perl", "Makefile"] },
    { category: "Domains", items: ["AI Accelerators", "SoC Design", "Memory Controllers", "DSP Blocks", "Mixed-Signal"] },
  ];

  // --- GOOGLE KNOWLEDGE GRAPH SCHEMA ---
  // This tells Google exactly who this person is.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dhaval Shukla",
    "jobTitle": "Physical Design Lead Engineer",
    "description": "Physical Design Lead Engineer specializing in AI chips, VLSI, and 5nm/7nm FinFET technologies.",
    "url": "https://dhavalshukla.com",
    "image": "https://tzaxthrqwfgbrcqmtuec.supabase.co/storage/v1/object/public/images/dhavalshukla.jpg",
    "nationality": "Indian",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Indian Institute of Technology (IIT)"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Quest Global"
    },
    // IMPORTANT: Replace these with his REAL social links for Google to verify identity
    "sameAs": [
      "https://www.linkedin.com/in/dhaval-shukla-vlsi", 
      "https://github.com/dhaval-shukla",
      "https://twitter.com/dhaval_vlsi" 
    ]
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* 1. SEO Meta Tags */}
      <SEO 
        title="About Mr. Dhaval Shukla" 
        description="Learn about Mr. Dhaval Shukla, a Physical Design Lead Engineer with 8+ years of experience in VLSI, AI Accelerators, and semiconductor technology."
      />

      {/* 2. Structured Data for Google */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Changed 'About Me' to 'About Dhaval Shukla' for better ranking */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Dhaval Shukla
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            Passionate about pushing the boundaries of semiconductor technology and sharing knowledge with the next generation of engineers.
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-8 md:p-10 border border-gray-200 shadow-lg mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Professional Journey</h2>
              <p className="text-gray-600 font-body leading-relaxed">
                With over 8 years of experience in VLSI physical design, I have contributed to the development of cutting-edge semiconductor products at leading companies. My expertise spans from RTL-to-GDSII flows, advanced node technologies (5nm/7nm), and complex SoC implementations.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 font-body leading-relaxed mb-4">
            I specialize in physical design for AI accelerators and high-performance computing chips, working extensively with industry-standard EDA tools from Synopsys and Cadence. My work involves managing complete physical design flows, from early floorplanning through final sign-off.
          </p>
          
          <p className="text-gray-700 font-body leading-relaxed">
            Beyond my professional work, I am passionate about education and knowledge sharing. Through this platform, I create tutorials, write technical articles, and provide career guidance to aspiring VLSI engineers worldwide.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
              <Award size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Work Experience</h2>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-blue-600 font-semibold font-body mb-1">
                      {exp.company}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                      <MapPin size={14} />
                      {exp.location}
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-700 font-body leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Code2 size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg text-sm font-mono border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <GraduationCap size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Education</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-gray-900">
                M.Tech in VLSI Design
              </h3>
              <p className="text-blue-600 font-semibold font-body">Indian Institute of Technology (IIT)</p>
              <p className="text-sm text-gray-500 font-mono">2013 - 2015</p>
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-gray-900">
                B.E. in Electronics and Communication
              </h3>
              <p className="text-blue-600 font-semibold font-body">VTU, Karnataka</p>
              <p className="text-sm text-gray-500 font-mono">2009 - 2013</p>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-xl"
        >
          <Mail size={32} className="mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-3">Let's Connect!</h2>
          <p className="text-blue-100 font-body mb-6 max-w-xl mx-auto">
            Interested in collaboration, consulting, or just want to discuss VLSI design? Feel free to reach out!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            data-testid="about-contact-button"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </div>
  );
}