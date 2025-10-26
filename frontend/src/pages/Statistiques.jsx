import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Statistiques.css';


const Statistiques = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    projectsByService: [],
    devisConversion: {
      total: 0,
      converted: 0,
      rate: 0
    },
    reviewsStats: {
      total: 0,
      averageRating: 0,
      ratingDistribution: {}
    }
  });


  useEffect(() => {
    fetchStatistics();
  }, []);


  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: { Authorization: `Bearer ${token}` }
      });


      // Récupérer toutes les données
      const [projetsRes, devisRes, avisRes, servicesRes] = await Promise.all([
        api.get('/projets'),
        api.get('/devis'),
        api.get('/avis/debug/firebase'),
        api.get('/services')
      ]);


      // 1. Nombre de projets par type de service
      const projectsByService = calculerProjetsParService(
        projetsRes.data.data,
        servicesRes.data.data
      );


      // 2. Taux de conversion des devis
      const devisConversion = calculerTauxConversion(devisRes.data.data);


      // 3. Statistiques des avis
      const reviewsStats = calculerStatsAvis(avisRes.data.data);


      setStats({
        projectsByService,
        devisConversion,
        reviewsStats
      });
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };


  const calculerProjetsParService = (projets, services) => {
    const serviceMap = {};


    // Initialiser avec tous les services
    services.forEach(service => {
      serviceMap[service.titre] = 0;
    });


    // Compter les projets par service
    projets.forEach(projet => {
      if (projet.serviceTitre && serviceMap.hasOwnProperty(projet.serviceTitre)) {
        serviceMap[projet.serviceTitre]++;
      }
    });


    return Object.entries(serviceMap).map(([service, count]) => ({
      service,
      count
    }));
  };


  const calculerTauxConversion = (devis) => {
    const total = devis.length;
    const converted = devis.filter(d =>
      d.statut === 'Accepté' || d.statut === 'Traité'
    ).length;
    const rate = total > 0 ? ((converted / total) * 100).toFixed(2) : 0;


    return { total, converted, rate };
  };


  const calculerStatsAvis = (avis) => {
    const approved = avis.filter(a => a.status === 'approved');
    const total = approved.length;


    if (total === 0) {
      return {
        total: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }


    const sum = approved.reduce((acc, a) => acc + (a.rating || 0), 0);
    const averageRating = (sum / total).toFixed(2);


    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    approved.forEach(a => {
      if (a.rating >= 1 && a.rating <= 5) {
        ratingDistribution[a.rating]++;
      }
    });


    return { total, averageRating, ratingDistribution };
  };


  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };


  if (loading) {
    return (
      <div className="stats-container">
        <div className="stats-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="stats-container">
        <div className="stats-error">
          <p>{error}</p>
          <button onClick={fetchStatistics} className="retry-btn">Réessayer</button>
        </div>
      </div>
    );
  }


  return (
    <div className="stats-container">
      <div className="stats-header">
        <button onClick={() => navigate('/admin')} className="back-btn">
          <ArrowLeft size={20} /> Retour au Dashboard
        </button>
        <h1 className="stats-title">
          <BarChart3 size={32} /> Statistiques & Rapports
        </h1>
        <p className="stats-subtitle">Vue d'ensemble des performances</p>
      </div>


      <div className="stats-grid">
        {/* KPI 1: Projets par type de service */}
        <div className="stat-card large">
          <div className="stat-card-header">
            <BarChart3 size={24} color="#2563eb" />
            <h2>Projets par Type de Service</h2>
          </div>
          <div className="chart-container">
            {stats.projectsByService.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.service}</div>
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(item.count / Math.max(...stats.projectsByService.map(s => s.count), 1)) * 100}%`
                    }}
                  >
                    <span className="bar-count">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
            {stats.projectsByService.length === 0 && (
              <p className="no-data">Aucun projet disponible</p>
            )}
          </div>
        </div>


        {/* KPI 2: Taux de conversion des devis */}
        <div className="stat-card">
          <div className="stat-card-header">
            <TrendingUp size={24} color="#28a745" />
            <h2>Conversion des Devis</h2>
          </div>
          <div className="conversion-content">
            <div className="conversion-metric">
              <div className="metric-value">{stats.devisConversion.rate}%</div>
              <div className="metric-label">Taux de conversion</div>
            </div>
            <div className="conversion-details">
              <div className="detail-item">
                <span className="detail-label">Total devis:</span>
                <span className="detail-value">{stats.devisConversion.total}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Convertis:</span>
                <span className="detail-value success">{stats.devisConversion.converted}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">En attente:</span>
                <span className="detail-value warning">
                  {stats.devisConversion.total - stats.devisConversion.converted}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* KPI 3: Avis et évaluations */}
        <div className="stat-card">
          <div className="stat-card-header">
            <Star size={24} color="#ffc107" />
            <h2>Avis Clients</h2>
          </div>
          <div className="reviews-content">
            <div className="reviews-summary">
              <div className="average-rating">
                <div className="rating-value">{stats.reviewsStats.averageRating}</div>
                <div className="rating-stars">{renderStars(stats.reviewsStats.averageRating)}</div>
                <div className="rating-count">{stats.reviewsStats.total} avis approuvés</div>
              </div>
            </div>
            <div className="rating-distribution">
              <h3>Répartition des notes</h3>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="distribution-row">
                  <span className="distribution-label">{rating} ★</span>
                  <div className="distribution-bar-wrapper">
                    <div
                      className="distribution-bar"
                      style={{
                        width: `${(stats.reviewsStats.ratingDistribution[rating] / Math.max(stats.reviewsStats.total, 1)) * 100}%`
                      }}
                    />
                  </div>
                  <span className="distribution-count">
                    {stats.reviewsStats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Statistiques;




