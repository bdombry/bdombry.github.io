-- Function to promote a user to admin (for testing purposes)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin'::user_role 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some more sample tutorials to have more content
INSERT INTO public.tutorials (title, slug, description, content, category_id, difficulty, duration, tags) VALUES
  (
    'JavaScript Moderne - ES6+',
    'javascript-moderne-es6',
    'Découvrez les fonctionnalités modernes de JavaScript : arrow functions, destructuring, async/await.',
    '# JavaScript Moderne - ES6+

JavaScript a considérablement évolué avec ES6 et les versions suivantes. Ce tutoriel couvre les fonctionnalités les plus importantes.

## Arrow Functions

```javascript
// Fonction traditionnelle
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
```

## Destructuring

```javascript
// Destructuring d''objet
const { name, age } = person;

// Destructuring de tableau
const [first, second] = array;
```

## Async/Await

```javascript
async function fetchData() {
  try {
    const response = await fetch(''/api/data'');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```',
    (SELECT id FROM public.categories WHERE slug = 'javascript'),
    'intermediate'::tutorial_difficulty,
    75,
    ARRAY['javascript', 'es6', 'moderne', 'async']
  ),
  (
    'Responsive Design avec CSS',
    'responsive-design-css',
    'Apprenez à créer des designs adaptatifs pour tous les écrans avec CSS.',
    '# Responsive Design avec CSS

Le responsive design est essentiel pour créer des sites web modernes qui s''adaptent à tous les appareils.

## Media Queries

```css
/* Mobile first */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

## Flexbox

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
```',
    (SELECT id FROM public.categories WHERE slug = 'css'),
    'beginner'::tutorial_difficulty,
    50,
    ARRAY['css', 'responsive', 'design', 'mobile']
  );