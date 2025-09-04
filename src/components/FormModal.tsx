import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface FormModalProps {
  triggerText: string;
  title: string;
  description: string;
}

export default function FormModal({ 
  triggerText, 
  title, 
  description 
}: FormModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-primary text-lg px-8 py-4">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </DialogTitle>
          <p className="text-gray-600">
            {description}
          </p>
        </DialogHeader>
        <div className="mt-6">
          <iframe 
            src="https://forms.monday.com/forms/embed/789ac55d6f7b9feee3e9cf55a7447ca5?r=euc1" 
            width="100%" 
            height="500" 
            style={{ 
              border: 0, 
              boxShadow: '5px 5px 56px 0px rgba(0,0,0,0.25)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
            title="Formulaire d'éligibilité vélo-cargo CEE"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}