import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant médical IA. Je peux vous aider à résumer des dossiers patients, rédiger des notes cliniques, ou suggérer des orientations médicales. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Cette fonctionnalité sera disponible prochainement avec l\'intégration complète de l\'API OpenAI. Pour le moment, c\'est une démonstration de l\'interface utilisateur.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] animate-in fade-in-50 duration-500">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Assistant Médical IA
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Posez votre question médicale..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Mode démo - L'IA sera activée avec Lovable Cloud
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assistant;
