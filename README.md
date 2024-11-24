# Haiku Pirate AES

**THIS IS MEANT FOR A GAME. IF YOU AREN'T PLAYING THE GAME, YOU PROBABLY SHOULDN'T USE THIS**

This is an AES text encrypter that maintains the interface of the Enigma Machine from crytpii.com.

It turns out that using Engima for clues in a game is pretty easy to crack. So I rewrote the same interface but using 256-bit AES instead.

No, the irony of re-writing old, broken crypto to use modern, good crypto but look like the old, broken crypto is not lost on me.

### How it works

It simply contructs a 32 character AES key out of the enigma settings. **Yes, there are caveats of doing this that make the key a bit weaker.** 

Example: take the default Enigma settings from cryptii.com (we use the same defaults)

Your resulting key will be `613AQLAAABQCRDIEJKWMTOSPXUZGH===`

First three characters are the Enigma Rotor numbers (1-8), the next 6 are the rotor settings (A-Z), the next 20 are the plugboard pairings. The final 3 characters are padding. 

`613 AQLAAA BQCRDIEJKWMTOSPXUZGH ===`

If your plug board is less than 20 characters, the remaining characters will be **padding**. **This means a less secure key.**

Example: random rotor settings with no plugboard:

`112ABXDRE=======================`

That's only 9 characters of entropy! Not exactly bulletproof crypto, but hard to brute force. 