import React, { useState } from 'react';
import Game from './components/Game';
import { Upload } from 'lucide-react';

function App() {
  const [whackerImage, setWhackerImage] = useState('');
  const [moleImage, setMoleImage] = useState('');

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Customize Your Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Whacker Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setWhackerImage)}
                  />
                </label>
                {whackerImage && (
                  <button
                    onClick={() => setWhackerImage('')}
                    className="text-red-500 hover:text-red-600"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Mole Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setMoleImage)}
                  />
                </label>
                {moleImage && (
                  <button
                    onClick={() => setMoleImage('')}
                    className="text-red-500 hover:text-red-600"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Game
          whackerImage={whackerImage}
          moleImage={moleImage || 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=150'}
          duration={30}
        />
      </div>
    </div>
  );
}

export default App;