
import React, { useState, useEffect, useMemo } from 'react';
import { Location } from '../types';

interface MoveItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (destination: Location) => void;
  itemCount: number;
  locations: Location[];
}

const MoveItemsDialog: React.FC<MoveItemsDialogProps> = ({ isOpen, onClose, onConfirm, itemCount, locations }) => {
  const possibleDestinations = useMemo(() => locations.filter(l => l !== Location.Bag), [locations]);

  const [destination, setDestination] = useState<Location | ''>('');

  useEffect(() => {
    if (isOpen) {
      if (possibleDestinations.length > 0) {
        setDestination(possibleDestinations[0]);
      } else {
        setDestination('');
      }
    }
  }, [isOpen, possibleDestinations]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (destination) {
        onConfirm(destination);
    }
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Move All Items from Bag</h2>
        
        {possibleDestinations.length > 0 ? (
            <>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  You are about to move <span className="font-bold text-slate-800 dark:text-slate-100">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} from your Bag.
                  Please select the new location.
                </p>

                <div className="space-y-2">
                    <label htmlFor="location-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Move to:
                    </label>
                    <select
                        id="location-select"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value as Location)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                    >
                        {possibleDestinations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </>
        ) : (
            <p className="text-slate-600 dark:text-slate-300">
                There are no available locations to move items to.
            </p>
        )}

        <div className="mt-8 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-slate-500"
            >
                Cancel
            </button>
            <button
                onClick={handleConfirm}
                disabled={!destination || itemCount === 0}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-rose-600 text-white shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-rose-500 disabled:bg-slate-400 disabled:text-slate-200 disabled:cursor-not-allowed dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
            >
                Confirm Move
            </button>
        </div>
      </div>
    </div>
  );
};

export default MoveItemsDialog;
