import { Card, Element, Molecule } from '../types/game';
import { MOLECULES } from '../data/molecules';

export function checkMoleculeFormation(cards: Card[]): Molecule[] {
  const completedMolecules: Molecule[] = [];
  const elementCounts: Record<Element, number> = {} as Record<Element, number>;
  
  // Count available elements
  cards.forEach(card => {
    elementCounts[card.element] = (elementCounts[card.element] || 0) + 1;
  });

  // Check each molecule
  MOLECULES.forEach(molecule => {
    let canForm = true;
    let timesCanForm = Infinity;

    // Check if we have enough of each required element
    Object.entries(molecule.elements).forEach(([element, required]) => {
      const available = elementCounts[element as Element] || 0;
      if (available < required) {
        canForm = false;
      } else {
        timesCanForm = Math.min(timesCanForm, Math.floor(available / required));
      }
    });

    // Add the molecule for each time it can be formed
    if (canForm && timesCanForm > 0) {
      for (let i = 0; i < timesCanForm; i++) {
        completedMolecules.push(molecule);
      }
    }
  });

  return completedMolecules;
}

export function getUsedCards(molecules: Molecule[], allCards: Card[]): Card[] {
  const usedCards: Card[] = [];
  const remainingCards = [...allCards];
  
  molecules.forEach(molecule => {
    Object.entries(molecule.elements).forEach(([element, count]) => {
      for (let i = 0; i < count; i++) {
        const cardIndex = remainingCards.findIndex(card => card.element === element as Element);
        if (cardIndex !== -1) {
          usedCards.push(remainingCards[cardIndex]);
          remainingCards.splice(cardIndex, 1);
        }
      }
    });
  });

  return usedCards;
}

export function calculateScore(molecules: Molecule[]): number {
  return molecules.reduce((total, molecule) => total + molecule.points, 0);
}