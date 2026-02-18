import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Code2, MapPin, Mail } from "lucide-react";
import SEO from "@/components/shared/SEO";
import { Helmet } from "react-helmet-async"; 
import { supabase } from "@/lib/supabaseClient";

export default function About() {
  const [pageData, setPageData] = useState({
    title: "About Dhaval Shukla",
    subtitle: "Passionate about pushing the boundaries of semiconductor technology and sharing knowledge with the next generation of engineers.",
    bio_paragraphs: [
      "With over 8 years of experience in VLSI physical design, I have contributed to the development of cutting-edge semiconductor products at leading companies. My expertise spans from RTL-to-GDSII flows, advanced node technologies (5nm/7nm), and complex SoC implementations.",
      "I specialize in physical design for AI accelerators and high-performance computing chips, working extensively with industry-standard EDA tools from Synopsys and Cadence. My work involves managing complete physical design flows, from early floorplanning through final sign-off.",
      "Beyond my professional work, I am passionate about education and knowledge sharing. Through this platform, I create tutorials, write technical articles, and provide career guidance to aspiring VLSI engineers worldwide."
    ],
    experiences: [
      { title: "Physical Design Lead Engineer", company: "Quest Global", location: "Bangalore, India", period: "2020 - Present", description: "Leading physical design implementation for AI accelerator chips in 5nm and 7nm FinFET technologies." }
    ],
    skills: [
      { category: "EDA Tools", items: ["Synopsys ICC2", "Cadence Innovus", "PrimeTime", "Design Compiler", "Calibre"] },
      { category: "Technologies", items: ["5nm/7nm FinFET", "Multi-VDD", "Low Power Design", "Clock Tree Synthesis", "DRC/LVS"] }
    ],
    education: [
      { degree: "M.Tech in VLSI Design", institution: "Indian Institute of Technology (IIT)", period: "2013 - 2015" }
    ]
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("value").eq("id", "about_page").single();
        if (data?.value) setPageData(data.value);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAboutData();
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dhaval Shukla",
    "jobTitle": "Physical Design Lead Engineer",
    "description": pageData.subtitle,
    "url": "https://dhavalshukla.com",
    "image": "https://tzaxthrqwfgbrcqmtuec.supabase.co/storage/v1/object/public/images/dhavalshukla.jpg",
    "nationality": "Indian",
    "sameAs": [
      "https://www.linkedin.com/in/dhaval-shukla-vlsi", 
      "https://github.com/dhaval-shukla"
    ]
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO title={pageData.title} description={pageData.subtitle} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {pageData.title}
          </h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            {pageData.subtitle}
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white rounded-xl p-8 md:p-10 border border-gray-200 shadow-lg mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Professional Journey</h2>
              <p className="text-gray-600 font-body leading-relaxed">
                {pageData.bio_paragraphs[0]}
              </p>
            </div>
          </div>
          {pageData.bio_paragraphs.slice(1).map((para, index) => (
            <p key={index} className="text-gray-700 font-body leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Experience Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg"><Award size={24} className="text-white" /></div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Work Experience</h2>
          </div>

          <div className="space-y-6">
            {pageData.experiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 card-hover">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{exp.title}</h3>
                    <p className="text-blue-600 font-semibold font-body mb-1">{exp.company}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                      <MapPin size={14} />{exp.location}
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-700 font-body leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"><Code2 size={24} className="text-white" /></div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pageData.skills.map((skillGroup, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200">
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, idx) => (
                    <span key={idx} className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg text-sm font-mono border border-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg"><GraduationCap size={24} className="text-white" /></div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Education</h2>
          </div>
          
          <div className="space-y-4">
            {pageData.education.map((edu, idx) => (
               <div key={idx}>
                <h3 className="text-lg font-heading font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600 font-semibold font-body">{edu.institution}</p>
                <p className="text-sm text-gray-500 font-mono">{edu.period}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <Mail size={32} className="mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-3">Let's Connect!</h2>
          <p className="text-blue-100 font-body mb-6 max-w-xl mx-auto">
            Interested in collaboration, consulting, or just want to discuss VLSI design? Feel free to reach out!
          </p>
          <a href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            Contact Me
          </a>
        </motion.div>
      </div>
    </div>
  );
}