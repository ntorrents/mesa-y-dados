import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AdminGameForm = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    players: '',
    minAge: '',
    duration: '',
    categories: '',
    difficulty: 'Fácil',
    rating: '',
    shortDescription: '',
    review: '',
    externalLink: '',
    pros: '',
    cons: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        players: initialData.players || '',
        minAge: initialData.minAge?.toString() || '',
        duration: initialData.duration || '',
        categories: initialData.categories?.join(', ') || '',
        difficulty: initialData.difficulty || 'Fácil',
        rating: initialData.rating?.toString() || '',
        shortDescription: initialData.shortDescription || '',
        review: initialData.review || '',
        externalLink: initialData.externalLink || '',
        pros: initialData.pros?.join('\n') || '',
        cons: initialData.cons?.join('\n') || ''
      });
    } else {
      // Reset form for adding new game
      setFormData({
        name: '', players: '', minAge: '', duration: '', categories: '',
        difficulty: 'Fácil', rating: '', shortDescription: '', review: '',
        externalLink: '', pros: '', cons: ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del juego es obligatorio",
        variant: "destructive"
      });
      return;
    }

    const processedData = {
      ...formData,
      minAge: parseInt(formData.minAge) || 0,
      rating: parseFloat(formData.rating) || null,
      categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
      pros: formData.pros.split('\n').filter(pro => pro.trim()),
      cons: formData.cons.split('\n').filter(con => con.trim())
    };

    onSubmit(processedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {initialData ? 'Editar Juego' : 'Añadir Nuevo Juego'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Nombre *</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Wingspan" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Jugadores</label>
                <Input name="players" value={formData.players} onChange={handleInputChange} placeholder="Ej: 1-5" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Edad Mínima</label>
                <Input name="minAge" type="number" value={formData.minAge} onChange={handleInputChange} placeholder="Ej: 10" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Duración</label>
                <Input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Ej: 40-70 min" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Dificultad</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full h-10 px-3 py-2 bg-slate-800 border border-white/20 rounded-md text-white">
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Rating (1-5)</label>
                <Input name="rating" type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={handleInputChange} placeholder="Ej: 4.5" className="glass-effect border-white/20 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-white font-medium mb-2">Categorías (separadas por comas)</label>
                  <Input name="categories" value={formData.categories} onChange={handleInputChange} placeholder="Ej: Estrategia, Familiar" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                  <label className="block text-white font-medium mb-2">Enlace Externo</label>
                  <Input name="externalLink" value={formData.externalLink} onChange={handleInputChange} placeholder="https://boardgamegeek.com/..." className="glass-effect border-white/20 text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Descripción Corta</label>
              <Input name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="Una breve descripción del juego" className="glass-effect border-white/20 text-white" />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Reseña Completa</label>
              <Textarea name="review" value={formData.review} onChange={handleInputChange} placeholder="Tu reseña detallada del juego..." rows={6} className="glass-effect border-white/20 text-white" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Pros (uno por línea)</label>
                <Textarea name="pros" value={formData.pros} onChange={handleInputChange} placeholder="Componentes de calidad&#10;Mecánicas elegantes" rows={4} className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Contras (uno por línea)</label>
                <Textarea name="cons" value={formData.cons} onChange={handleInputChange} placeholder="Curva de aprendizaje inicial&#10;Puede ser lento" rows={4} className="glass-effect border-white/20 text-white" />
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Guardar Cambios' : 'Añadir Juego'}
              </Button>
              <Button type="button" onClick={onCancel} variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminGameForm;