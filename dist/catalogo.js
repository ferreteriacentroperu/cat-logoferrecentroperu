const projectUrl = "https://veqqzxhyypbqwfxdosof.supabase.co";
const publishableKey = "sb_publishable_7XcLiG39-xa2yZct4z_4PQ_8I0hwyQz";
const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

async function readPublished(table, columns) {
  const url = new URL('/rest/v1/' + table, projectUrl);
  url.search = new URLSearchParams({
    select: columns,
    publicado: 'eq.true',
    order: 'orden.asc,id.asc',
    limit: '100',
  });
  const response = await fetch(url, { headers: { apikey: publishableKey } });
  if (!response.ok) throw new Error('No se pudo cargar ' + table);
  return response.json();
}

function addText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
  return element;
}

function addPhoto(parent, source, alt) {
  if (!source?.startsWith('https://')) return;
  const image = document.createElement('img');
  image.src = source;
  image.alt = alt;
  image.loading = 'lazy';
  image.referrerPolicy = 'no-referrer';
  parent.append(image);
}

function productCard(product) {
  const card = document.createElement('article');
  card.className = 'product';
  addPhoto(card, product.imagen_url, product.nombre);
  const body = addText(card, 'div', '');
  body.className = 'card-body';
  addText(body, 'p', product.categoria === 'combo' ? 'Combo' : 'Herramienta');
  addText(body, 'h3', product.nombre);
  if (product.descripcion) addText(body, 'p', product.descripcion);
  addText(body, 'strong', product.precio_pen === null ? 'Precio por consultar' : soles.format(product.precio_pen));
  const link = addText(body, 'a', 'Consultar por WhatsApp');
  link.className = 'button yellow product-chat';
  const message = 'Hola, Alejandra. Quisiera consultar por ' + product.nombre + '.';
  link.href = 'https://wa.me/51933280403?text=' + encodeURIComponent(message);
  return card;
}

function testimonialCard(testimonial) {
  const card = document.createElement('div');
  addText(card, 'h3', testimonial.modalidad === 'lima' ? 'Entrega en Lima' : 'Recojo en Shalom');
  addPhoto(card, testimonial.imagen_url, 'Foto compartida por el cliente');
  addText(card, 'blockquote', testimonial.comentario);
  if (testimonial.autor) addText(card, 'p', testimonial.autor);
  return card;
}

async function populate(table, columns, elementId, render) {
  try {
    const rows = await readPublished(table, columns);
    if (!rows.length) return;
    const container = document.getElementById(elementId);
    container.replaceChildren(...rows.map(render));
    container.hidden = false;
    if (table === 'testimonios') document.getElementById('testimonios-pendientes').hidden = true;
  } catch (error) {
    console.warn(error.message);
  }
}

populate('productos', 'id,categoria,nombre,descripcion,precio_pen,imagen_url', 'productos-publicados', productCard);
populate('testimonios', 'id,modalidad,autor,comentario,imagen_url', 'testimonios-publicados', testimonialCard);
