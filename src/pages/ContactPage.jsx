
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío del formulario
    setTimeout(() => {
      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por tu mensaje. Te responderé lo antes posible."
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactReasons = [
    {
      icon: MessageSquare,
      title: "Recomendaciones de Juegos",
      description: "¿Tienes algún juego que te gustaría que reseñe? ¡Compártelo conmigo!"
    },
    {
      icon: Mail,
      title: "Colaboraciones",
      description: "Interesado en colaborar o tienes una propuesta? Hablemos."
    },
    {
      icon: CheckCircle,
      title: "Feedback",
      description: "Tu opinión sobre el sitio web y las reseñas es muy valiosa."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contacto - Mesa & Dados</title>
        <meta name="description" content="Ponte en contacto conmigo para recomendaciones de juegos, colaboraciones o cualquier consulta sobre juegos de mesa." />
      </Helmet>

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Contacto
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              ¿Tienes alguna recomendación, pregunta o simplemente quieres charlar sobre juegos? 
              ¡Me encanta escuchar de otros jugones!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Razones para contactar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">¿En qué puedo ayudarte?</h2>
              
              {contactReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="glass-effect border-white/10 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                          <reason.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-2">{reason.title}</h3>
                          <p className="text-gray-400 text-sm">{reason.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Información adicional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass-effect rounded-lg p-6 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3">Tiempo de respuesta</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Normalmente respondo en 24-48 horas. Si es sobre una recomendación urgente 
                  para una partida del fin de semana, ¡intentaré ser más rápido!
                </p>
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Todas las consultas son bienvenidas
                </div>
              </motion.div>
            </motion.div>

            {/* Formulario de contacto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Envíame un mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-white font-medium mb-2">
                          Nombre *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className="glass-effect border-white/20 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="tu@email.com"
                          className="glass-effect border-white/20 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-white font-medium mb-2">
                        Asunto *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full h-10 px-3 py-2 bg-slate-800 border border-white/20 rounded-md text-white"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="recomendacion">Recomendación de juego</option>
                        <option value="colaboracion">Colaboración</option>
                        <option value="feedback">Feedback del sitio</option>
                        <option value="pregunta">Pregunta general</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white font-medium mb-2">
                        Mensaje *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Cuéntame qué tienes en mente..."
                        rows={6}
                        className="glass-effect border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA adicional */}
          <motion.div
            initial={{ opacity: 0,y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="glass-effect border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                ¿Prefieres las redes sociales?
              </h2>
              <p className="text-gray-400 mb-6">
                También puedes encontrarme en mis redes sociales donde comparto 
                actualizaciones rápidas y fotos de partidas.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => toast({
                    title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
                  })}
                >
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => toast({
                    title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
                  })}
                >
                  Instagram
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={() => toast({
                    title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
                  })}
                >
                  BGG
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
