import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { agentsAPI } from '../services/modules';
import { useCMSSettings } from '../hooks/useCMSSettings';

const PublicAgents = () => {
  const { isVisible } = useCMSSettings();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isVisible('agentsSection')) {
      setLoading(false);
      return;
    }

    const fetchAgents = async () => {
      try {
        setLoading(true);
        const data = await agentsAPI.getPublicAgents();
        setAgents(data.results || data);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [isVisible('agentsSection')]);

  if (!isVisible('agentsSection')) {
    return null; // Section is disabled in CMS settings
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Agents</h2>
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => navigate(0)} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Agents</h2>
          <div className="text-gray-600">
            <p className="text-lg mb-4">No agents available at the moment.</p>
            <p>Please check back later or contact us directly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Agents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Agent Photo */}
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                {agent.photo_url ? (
                  <img
                    src={agent.photo_url}
                    alt={`${agent.first_name} ${agent.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No Photo</p>
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {agent.first_name && agent.last_name 
                    ? `${agent.first_name} ${agent.last_name}`
                    : agent.username || 'Agent'
                  }
                </h3>
                
                {agent.title && (
                  <p className="text-blue-600 font-medium mb-3">{agent.title}</p>
                )}

                {agent.bio && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{agent.bio}</p>
                )}

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${agent.email}`} className="hover:text-blue-600">
                      {agent.email}
                    </a>
                  </div>

                  {agent.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${agent.phone}`} className="hover:text-blue-600">
                        {agent.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Agents Message */}
        {agents.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              No agents are currently available. Please check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicAgents;
