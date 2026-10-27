import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, ShieldCheck, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export const PdfsCatalogPage = ({ onPurchasePdf }) => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const res = await api.getPdfs();
        if (res.success) {
          setPdfs(res.pdfs);
        }
      } catch (err) {
        console.error('Error fetching PDFs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ color: '#d97706', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          OFFICIAL COMPILATIONS & RESEARCH PAPERS
        </div>
        <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '2.2rem', color: '#0a2540', marginTop: '6px' }}>
          Digital Study Materials & Handouts Vault
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Standardized high-yield revision summaries, Odisha state gazette highlights, and exam-oriented question compilations.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          Loading document repository...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {pdfs.map((pdf) => (
            <div key={pdf._id} className="gov-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span
                  style={{
                    background: '#f1f5f9',
                    color: '#0a2540',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {pdf.examCategory}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {pdf.totalPages} Pages • {pdf.fileSizeMb}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h3 style={{ color: '#0a2540', fontSize: '1.05rem', lineHeight: '1.4' }}>
                    {pdf.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                {pdf.description}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                  {pdf.price === 0 ? (
                    <span style={{ color: '#059669', fontWeight: '800', fontSize: '1.1rem' }}>FREE ACCESS</span>
                  ) : (
                    <span style={{ color: '#0a2540', fontWeight: '800', fontSize: '1.2rem', fontFamily: 'Cinzel, serif' }}>
                      ₹{pdf.price}
                    </span>
                  )}
                </div>

                {pdf.price === 0 ? (
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline"
                    style={{ padding: '6px 14px', fontSize: '0.82rem', textDecoration: 'none' }}
                  >
                    <Download size={14} /> Download Free
                  </a>
                ) : (
                  <button
                    className="btn-accent"
                    onClick={() => onPurchasePdf(pdf)}
                    style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                  >
                    Unlock & Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
