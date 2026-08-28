INSERT INTO planets (name, description) VALUES
('Mercury', 'The smallest planet and the closest planet to the Sun.'),
('Venus', 'A hot, rocky planet with a thick atmosphere.'),
('Earth', 'Our home planet and the only known world with life.'),
('Mars', 'A cold, rocky world known as the Red Planet.'),
('Jupiter', 'The largest planet in the Solar System.'),
('Saturn', 'A gas giant famous for its extensive ring system.'),
('Uranus', 'An ice giant with a strongly tilted axis of rotation.'),
('Neptune', 'A distant ice giant with powerful winds.')
ON CONFLICT (name) DO NOTHING;
