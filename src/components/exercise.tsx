import React from 'react';

// Multiple choice and multiple answer exercises

// Invuloefeningen (kan ook met multiple choice dropdown)
// Foutenmarge bij invuloefening

// Oefeningen in de les zelf staan in een Card met een reeks van een of meerdere vragen weergegeven met een Stepper.
// Na het indienen van de volledige reeks, krijg je je score te zien samen met een knop "Toon oplossingen". De bolletjes van de stepper veranderen ook in vinkjes of kruisjes. Wanneer je op de knop "Toon oplossingen" klikt, spoelt de Stepper terug naar de eerste vraag en zie je welk antwoord je had gegeven en welk antwoord juist is. Onderaan komt een veld met uitleg hoe je tot de juiste oplossing kan komen.

// Op apart oefenblad (per les) staan oefeningen genummerd onder elkaar. De titel van een oefening bestaat uit de nummering, samen met een korte versie van de opdracht (bv. "Vul in" of "Los op"), of een indicatie waar de oefening over gaat (bv. "De omheining van boer Teun").
// Onder de oefening staat een knop "Controleer antwoord". Wanneer je hierop klikt, zie je of / welke antwoorden juist/fout waren. In een Card zie je hoe je tot de juiste oplossing kan komen.

// In bare lessen staan de oefeningen in de les zelf onder elkaar. Helemaal onderaan de pagina staan de uitwerkingen van elke oefening. Op de oefenbladen staan de oefeningen genummerd onder elkaar, gevolgd door de titel "Oplossingen" en de uitwerkingen per oefening.

// ! Vraag bestaat uit markdown tekst waarin op eender welke plek een antwoord-mogelijkheid kan voorkomen die in zekere mate mee de eindscore op die vraag bepaalt (bv. via weight-parameter die default overal op 1 staat). Hoe kan een Answer-component die tussen de markdown staat haar score communiceren met de Exercise-component die deze vervolgens door-communiceert naar de Stepper?
