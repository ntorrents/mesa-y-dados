import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from "@/components/ui/checkbox";

const AdminBlogForm = ({ initialData, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readTime: '',
    featured: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category || '',
        readTime: initialData.readTime || '',
        featured: initialData.featured || false
      });
    } else {
      setFormData({
        title: '', excerpt: '', content: '', category: '', readTime: '', featured: false
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Título, extracto y contenido son obligatorios.",
        variant: "destructive"
      });
      return;
    }
    onSubmit(formData);
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
            {initialData ? 'Editar Artículo' : 'Añadir Nuevo Artículo'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Título *</label>
              <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="El título del artículo" className="glass-effect border-white/20 text-white" />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Extracto *</label>
              <Textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="Un resumen corto y atractivo" rows={2} className="glass-effect border-white/20 text-white" />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Contenido Completo *</label>
              <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="El contenido del artículo. Puedes usar markdown." rows={10} className="glass-effect border-white/20 text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Categoría</label>
                <Input name="category" value={formData.category} onChange={handleInputChange} placeholder="Ej: Rankings" className="glass-effect border-white/20 text-white" />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Tiempo de Lectura</label>
                <Input name="readTime" value={formData.readTime} onChange={handleInputChange} placeholder="Ej: 8 min" className="glass-effect border-white/20 text-white" />
              </div>
              <div className="flex items-end pb-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" name="featured" checked={formData.featured} onCheckedChange={(checked) => handleInputChange({ target: { name: 'featured', value: checked, type: 'checkbox', checked } })} />
                  <label htmlFor="featured" className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    ¿Artículo destacado?
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Save className="h-4 w-4 mr-2" />
                {initialData ? 'Guardar Cambios' : 'Publicar Artículo'}
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

export default AdminBlogForm;