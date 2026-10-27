import React from 'react';
import { Landmark, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="gov-footer">
      <div className="footer-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="gov-seal-icon" style={{ width: '38px', height: '38px' }}>
                <Landmark size={20} />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                STATE PUBLIC ACADEMY
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#94a3b8' }}>
              An apex state educational academy dedicated to competitive civil services preparation, state-of-the-art physical reference library reading spaces, and high-standard digital learning resources.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Public Portals
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: '2' }}>
              <li><a href="#library" style={{ color: '#94a3b8', textDecoration: 'none' }}>Physical Library Seat Availability</a></li>
              <li><a href="#courses" style={{ color: '#94a3b8', textDecoration: 'none' }}>OPSC / OAS Examination Modules</a></li>
              <li><a href="#pdfs" style={{ color: '#94a3b8', textDecoration: 'none' }}>Digital Research Papers & Notes</a></li>
              <li><a href="#tests" style={{ color: '#94a3b8', textDecoration: 'none' }}>Online Computer-Based Mock Tests</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Administrative Secretariat
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.8' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#d97706" /> Sachivalaya Marg, Unit 3, Bhubaneswar, Odisha 751001
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#d97706" /> 1800-345-0199 / 0674-2391000
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#d97706" /> support@stateacademy.gov.in
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Statutory Disclaimers
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.6' }}>
              Content owned, maintained and operated by State Academy of Civil Services. Hosted by Government Data Center. All rights reserved under National Intellectual Property Rights Act.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: '#34d399', fontSize: '0.78rem' }}>
              <ShieldCheck size={16} /> 256-Bit SSL Secure Citizen Portal
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} State Academy of Civil Services & Central Library. Government of Odisha.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Right to Information (RTI)</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Audit Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
