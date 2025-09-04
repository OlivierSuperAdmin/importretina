interface NoteProps {
  title: string;
  text: string;
  muted?: boolean;
}

export default function Note({ title, text, muted = false }: NoteProps) {
  return (
    <section className={`${muted ? 'bg-gray-50' : 'bg-white'} py-12`}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className={`${muted ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-3 ${muted ? 'text-gray-700' : 'text-gray-900'}`}>
              {title}
            </h3>
            <p className={`text-sm leading-relaxed ${muted ? 'text-gray-600' : 'text-gray-700'}`}>
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}