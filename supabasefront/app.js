// Selecionando os elementos necessários do DOM
const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description'); // Linha adicionada para selecionar a descrição do produto

// Função para buscar todos os produtos do servidor
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  // Limpar a lista de produtos
  productList.innerHTML = '';

  // Adicionar cada produto na lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price}`;

    // Adicionar botão de deletar para cada produto
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Adicionar botão de atualizar para cada produto
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description; // Linha adicionada para preencher a descrição no formulário de atualização
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener para o botão de submit do formulário de adicionar produto
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value; // Linha adicionada para pegar a descrição do formulário
  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

// Event listener para o botão de submit do formulário de atualizar produto
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value; // Linha adicionada para pegar a descrição do formulário
  await updateProduct(id, name, price, description);
  updateProductForm.reset();
  await fetchProducts();
});

// Função para adicionar um novo produto
async function addProduct(name, price, description) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description }) // Linha modificada para incluir a descrição no corpo da requisição
  });
  return response.json();
}

// Função para atualizar um produto existente
async function updateProduct(id, name, price, description) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description }) // Linha modificada para incluir a descrição no corpo da requisição
  });
  return response.json();
}

// Função para deletar um produto
async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}

// Buscar todos os produtos quando a página carregar
fetchProducts();
