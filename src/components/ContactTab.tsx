import React from 'react';
import { Phone, Mail, Github, Linkedin, Twitter, ExternalLink, MapPin, MessageCircle, Building2 } from 'lucide-react';

const ContactTab: React.FC = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (415) 555-0123',
      href: 'tel:+14155550123',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'drbolt@medtech.ai',
      href: 'mailto:drbolt@medtech.ai',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'text-gray-800',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-800',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com',
      color: 'text-sky-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      iconColor: 'text-sky-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Have questions about Dr. Bolt or need support? We're here to help you with your AI health consultation experience.
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {contactInfo.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className={`
                ${contact.bgColor} ${contact.borderColor} border rounded-xl p-6 
                hover:shadow-lg transform hover:scale-105 transition-all duration-200
                block text-center group
              `}
            >
              <div className={`${contact.iconColor} mb-4`}>
                <contact.icon className="h-12 w-12 mx-auto group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{contact.label}</h3>
              <p className={`${contact.color} font-medium`}>{contact.value}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Follow Us</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                ${social.bgColor} ${social.borderColor} border rounded-xl p-6 
                hover:shadow-lg transform hover:scale-105 transition-all duration-200
                block text-center group
              `}
            >
              <div className={`${social.iconColor} mb-3`}>
                <social.icon className="h-10 w-10 mx-auto group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{social.label}</h3>
              <ExternalLink className="h-4 w-4 text-gray-400 mx-auto" />
            </a>
          ))}
        </div>
      </div>

      {/* Google Map - San Francisco */}
      <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101409.8813981281!2d-122.16370132924663!3d37.41208521047047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7495bec0189%3A0x7c17d44a466baf9b!2sMountain%20View%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1751268962945!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Dr. Bolt Location - San Francisco, CA"
        ></iframe>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">About Dr. Bolt</h3>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Dr. Bolt is an innovative AI-powered health consultation platform designed to provide 
            preliminary health guidance through natural voice interactions. Our mission is to make 
            healthcare more accessible while emphasizing the importance of professional medical care.
          </p>
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-xl">
            <p className="text-yellow-800 text-sm font-medium">
              Remember: Dr. Bolt is for informational purposes only and should never replace 
              professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;