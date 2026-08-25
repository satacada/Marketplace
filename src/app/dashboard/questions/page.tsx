'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Question = {
  id: string;
  question: string;
  answer: string | null;
  is_read: boolean;
  is_answered: boolean;
  created_at: string;
  product_id: string;
  buyer_id: string;
  products: { 
    title: string; 
    description: string | null;
    image_urls: string[] | null;
    price: number;
  } | null;
  profiles: { email: string; store_name: string | null } | null;
};

type QuestionStatus = 'unread' | 'pending' | 'answered';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answerImageFile, setAnswerImageFile] = useState<File | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | QuestionStatus>('all');
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', user.id);

    if (!products || products.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const productIds = products.map(p => p.id);

    const { data, error } = await supabase
      .from('questions')
      .select(`
        id, question, answer, is_read, is_answered, created_at, product_id, buyer_id,
        products (title, description, image_urls, price),
        profiles (email, store_name)
      `)
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar preguntas:', error);
    } else {
      const mapped = data?.map(q => ({
        ...q,
        products: q.products?.[0] || null,
        profiles: q.profiles?.[0] || null
      })) || [];
      
      setQuestions(mapped);
    }
    setLoading(false);
  };

  const getStatus = (q: Question): QuestionStatus => {
    if (q.is_answered) return 'answered';
    if (q.is_read) return 'pending';
    return 'unread';
  };

  const getStatusConfig = (status: QuestionStatus) => {
    switch (status) {
      case 'unread':
        return { label: 'Sin leer', color: 'bg-red-100 text-red-800 border-red-300', icon: '🔴' };
      case 'pending':
        return { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🟡' };
      case 'answered':
        return { label: 'Respondida', color: 'bg-green-100 text-green-800 border-green-300', icon: '🟢' };
    }
  };

  const filteredQuestions = filter === 'all' 
    ? questions 
    : questions.filter(q => getStatus(q) === filter);

  // Al expandir, marcar automáticamente como leída
  const handleToggleExpand = async (question: Question) => {
    const newExpandedId = expandedId === question.id ? null : question.id;
    setExpandedId(newExpandedId);

    // Si se está expandiendo y no estaba leída, marcarla
    if (newExpandedId === question.id && !question.is_read) {
      await supabase
        .from('questions')
        .update({ is_read: true })
        .eq('id', question.id);
      
      setQuestions(questions.map(q => 
        q.id === question.id ? { ...q, is_read: true } : q
      ));
    }
  };

  const handleSendAnswer = async (questionId: string) => {
    if (!answerText.trim()) return;
    setSubmittingId(questionId);

    let finalAnswer = answerText;

    // Subir foto adjunta si fue seleccionada por el vendedor
    if (answerImageFile && userId) {
      try {
        const fileExt = answerImageFile.name.split('.').pop();
        const fileName = `${Date.now()}_ans_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userId}/questions/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(filePath, answerImageFile);

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            finalAnswer = `${answerText}\n\n[📷 Foto adjunta de respuesta]: ${urlData.publicUrl}`;
          }
        }
      } catch (err) {
        console.error('Error al subir foto adjunta:', err);
      }
    }

    const { error } = await supabase
      .from('questions')
      .update({ 
        answer: finalAnswer, 
        is_answered: true, 
        is_read: true 
      })
      .eq('id', questionId);

    setSubmittingId(null);

    if (error) {
      alert('Error al responder: ' + error.message);
    } else {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, answer: finalAnswer, is_answered: true, is_read: true } : q
      ));
      setAnswerText('');
      setAnswerImageFile(null);
      setExpandedId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-gray-500 text-center py-8">Cargando preguntas...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Preguntas Recibidas</h1>
        <p className="text-gray-600 mt-1">Gestiona las preguntas de los compradores sobre tus productos</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({questions.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'unread' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
           Sin leer ({questions.filter(q => getStatus(q) === 'unread').length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
           Pendientes ({questions.filter(q => getStatus(q) === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'answered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🟢 Respondidas ({questions.filter(q => getStatus(q) === 'answered').length})
        </button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
          <p className="text-6xl mb-4">💬</p>
          <p className="text-gray-500 text-lg">
            {filter === 'all' ? 'Aún no has recibido preguntas.' : 'No hay preguntas con este filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const status = getStatus(q);
            const config = getStatusConfig(status);
            const isExpanded = expandedId === q.id;

            return (
              <div 
                key={q.id} 
                className={`bg-white rounded-lg shadow-md border-2 transition ${
                  status === 'unread' ? 'border-red-300' : 
                  status === 'pending' ? 'border-yellow-300' : 'border-gray-200'
                }`}
              >
                {/* Cabecera: Nombre del producto */}
                <button
                  onClick={() => handleToggleExpand(q)}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition"
                >
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {q.products?.title || 'Producto eliminado'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(q.created_at).toLocaleDateString('es-AR', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-gray-400 text-xl">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </button>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                    {/* Info del producto */}
                    {q.products && (
                      <div className="flex gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                        {q.products.image_urls?.[0] ? (
                          <img 
                            src={q.products.image_urls[0]} 
                            alt={q.products.title}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 flex-shrink-0">
                            <span className="text-3xl">📦</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/marketplace/product/${q.product_id}`}
                            className="text-lg font-bold text-indigo-600 hover:text-indigo-700 line-clamp-1"
                          >
                            {q.products.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {q.products.description || 'Sin descripción'}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            ${q.products.price}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Info del comprador */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Comprador:</p>
                      <p className="text-gray-900 font-medium">{q.profiles?.email || 'Usuario anónimo'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(q.created_at).toLocaleDateString('es-AR', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Pregunta completa */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Pregunta:</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{q.question}</p>
                    </div>

                    {/* Respuesta existente */}
                    {q.answer && (
                      <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tu respuesta:</p>
                        <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200/90 text-sm text-gray-900 font-medium whitespace-pre-wrap">
                          {q.answer}
                        </div>
                      </div>
                    )}

                    {/* Acciones para Responder con opción de Adjuntar Foto */}
                    {!q.is_answered && (
                      <div className="border-t border-gray-200 pt-4 space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-700">Responder al comprador:</p>
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Escribe tu respuesta clara y detallada..."
                          className="w-full p-3 border border-gray-300 rounded-xl text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        />

                        {/* Adjunto de Foto Opcional en Castellano */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            📷 Adjuntar foto explicativa o comprobante (opcional):
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAnswerImageFile(e.target.files?.[0] || null)}
                            className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          />
                          {answerImageFile && (
                            <p className="text-xs text-emerald-700 font-bold mt-1">
                              ✓ Foto seleccionada: {answerImageFile.name}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleSendAnswer(q.id)}
                          disabled={submittingId === q.id || !answerText.trim()}
                          className={`w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 shadow-2xs ${
                            submittingId === q.id || !answerText.trim()
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                          }`}
                        >
                          <span>{submittingId === q.id ? '⏳ Enviando respuesta...' : '📤 Enviar Respuesta al Comprador'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}