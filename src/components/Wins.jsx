import React from 'react';
import winsData from '../data/wins.json';

function Wins() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Our Achievements</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winsData.map((win, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <img src={win.image} alt={win.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{win.title}</h3>
              <p className="text-gray-400">{win.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Wins;