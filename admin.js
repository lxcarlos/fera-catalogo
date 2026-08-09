// admin.js — Panel de administración Fera

let currentUser = null;
let currentRole = null;
let allProducts = [];

// ───────── LOGIN ─────────

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");
  errorEl.textContent = "";

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = "Correo o contraseña incorrectos.";
    return;
  }
  await checkSession();
});

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    showView("login");
    return;
  }
  currentUser = session.user;

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("role, full_name")
    .eq("id", currentUser.id)
    .single();

  if (error || !profile || profile.role === "comprador") {
    showView("noAccess");
    return;
  }

  currentRole = profile.role;
  showView("admin");
  document.getElementById("roleLabel").textContent = currentRole.toUpperCase();

  const canEdit = currentRole === "root" || currentRole === "gerente";
  document.getElementById("newProductBtn").style.display = canEdit ? "inline-block" : "none";
  document.getElementById("actionsHeader").style.display = canEdit ? "table-cell" : "none";

  await loadAdminProducts();
}

function showView(view) {
  document.getElementById("loginView").style.display = view === "login" ? "flex" : "none";
  document.getElementById("noAccessView").style.display = view === "noAccess" ? "flex" : "none";
  document.getElementById("adminView").style.display = view === "admin" ? "block" : "none";
}

async function logout() {
  await supabaseClient.auth.signOut();
  showView("login");
}
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("logoutBtnNoAccess").addEventListener("click", logout);

checkSession();

// ───────── CARGAR Y DIBUJAR PRODUCTOS ─────────

async function loadAdminProducts() {
  const { data: products, error: pErr } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: inventory, error: iErr } = await supabaseClient
    .from("inventory")
    .select("*");

  if (pErr) { console.error(pErr); return; }

  allProducts = products.map(p => {
    const inv = (inventory || []).find(i => i.product_id === p.id);
    return { ...p, quantity: inv ? inv.quantity : 0 };
  });

  renderProductsTable();
}

function renderProductsTable() {
  const canEdit = currentRole === "root" || currentRole === "gerente";
  const tbody = document.getElementById("productsTableBody");

  tbody.innerHTML = allProducts.map(p => `
    <tr>
      <td><img src="${p.img || ''}" alt=""></td>
      <td>${p.collection || ""} ${p.name}</td>
      <td>$${Number(p.price).toLocaleString("es-MX")}</td>
      <td>${p.price_wholesale ? "$" + Number(p.price_wholesale).toLocaleString("es-MX") : "—"}</td>
      <td>${p.quantity}</td>
      <td>${p.status}</td>
      ${canEdit ? `<td><button onclick="openEditModal('${p.id}')">Editar</button></td>` : ""}
    </tr>
  `).join("");
}

// ───────── MODAL: abrir / cerrar ─────────

const modal = document.getElementById("productModal");

document.getElementById("newProductBtn").addEventListener("click", () => openEditModal(null));
document.getElementById("closeModalBtn").addEventListener("click", () => modal.style.display = "none");

function openEditModal(productId) {
  document.getElementById("formError").textContent = "";
  const isNew = !productId;
  const p = isNew ? null : allProducts.find(x => x.id === productId);

  document.getElementById("modalTitle").textContent = isNew ? "Nuevo producto" : "Editar producto";
  document.getElementById("editingId").value = isNew ? "" : p.id;
  document.getElementById("f_id").value = isNew ? "" : p.id;
  document.getElementById("f_id").disabled = !isNew; // el ID no se cambia una vez creado
  document.getElementById("f_name").value = p ? p.name : "";
  document.getElementById("f_collection").value = p ? (p.collection || "") : "";
  document.getElementById("f_specs").value = p ? (p.specs || "") : "";
  document.getElementById("f_material").value = p ? (p.material || "") : "";
  document.getElementById("f_description").value = p ? (p.description || "") : "";
  document.getElementById("f_price").value = p ? p.price : "";
  document.getElementById("f_price_wholesale").value = p ? (p.price_wholesale || "") : "";
  document.getElementById("f_status").value = p ? p.status : "disponible";
  document.getElementById("f_imageFile").value = "";
  document.getElementById("f_imgManual").value = p ? (p.img || "") : "";
  document.getElementById("currentImgPreview").textContent = p && p.img ? `Imagen actual: ${p.img}` : "";
  document.getElementById("f_images").value = p && p.images ? p.images.join(", ") : "";
  document.getElementById("f_video").value = p ? (p.video || "") : "";
  document.getElementById("f_quantity").value = p ? p.quantity : 0;

  document.querySelectorAll(".f_section").forEach(cb => {
    cb.checked = p && p.sections ? p.sections.includes(cb.value) : false;
  });

  document.getElementById("deleteProductBtn").style.display = (!isNew && currentRole === "root") ? "inline-block" : "none";
  modal.style.display = "flex";
}

// ───────── SUBIR IMAGEN A SUPABASE STORAGE ─────────

async function uploadImageIfNeeded(productId) {
  const fileInput = document.getElementById("f_imageFile");
  const manualPath = document.getElementById("f_imgManual").value.trim();

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const path = `${productId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabaseClient.storage.from("productos").upload(path, file);
    if (error) throw new Error("Error subiendo imagen: " + error.message);

    const { data: publicUrlData } = supabaseClient.storage.from("productos").getPublicUrl(path);
    return publicUrlData.publicUrl;
  }

  // Si no subió archivo, usa lo que haya escrito a mano
  return manualPath || null;
}

// ───────── GUARDAR (crear o editar) ─────────

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorEl = document.getElementById("formError");
  errorEl.textContent = "";

  const isNew = !document.getElementById("editingId").value;
  const id = document.getElementById("f_id").value.trim();

  if (!id) { errorEl.textContent = "El ID es obligatorio."; return; }

  try {
    const imgUrl = await uploadImageIfNeeded(id);

    const sections = Array.from(document.querySelectorAll(".f_section:checked")).map(cb => cb.value);
    const imagesText = document.getElementById("f_images").value.trim();
    const images = imagesText ? imagesText.split(",").map(s => s.trim()) : (imgUrl ? [imgUrl] : []);

    const payload = {
      id,
      name: document.getElementById("f_name").value.trim(),
      collection: document.getElementById("f_collection").value.trim(),
      specs: document.getElementById("f_specs").value.trim(),
      material: document.getElementById("f_material").value.trim(),
      description: document.getElementById("f_description").value.trim(),
      price: parseFloat(document.getElementById("f_price").value),
      price_wholesale: document.getElementById("f_price_wholesale").value
        ? parseFloat(document.getElementById("f_price_wholesale").value) : null,
      status: document.getElementById("f_status").value,
      sections,
      img: imgUrl,
      images,
      video: document.getElementById("f_video").value.trim() || null,
      updated_at: new Date().toISOString()
    };

    let saveError;
    if (isNew) {
      const { error } = await supabaseClient.from("products").insert(payload);
      saveError = error;
    } else {
      const { error } = await supabaseClient.from("products").update(payload).eq("id", id);
      saveError = error;
    }
    if (saveError) throw new Error(saveError.message);

    // Guardar inventario
    const qty = parseInt(document.getElementById("f_quantity").value) || 0;
    const { data: existingInv } = await supabaseClient
      .from("inventory").select("id").eq("product_id", id).maybeSingle();

    if (existingInv) {
      await supabaseClient.from("inventory")
        .update({ quantity: qty, updated_at: new Date().toISOString(), updated_by: currentUser.id })
        .eq("product_id", id);
    } else {
      await supabaseClient.from("inventory")
        .insert({ product_id: id, quantity: qty, updated_by: currentUser.id });
    }

    modal.style.display = "none";
    await loadAdminProducts();
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

// ───────── ELIMINAR (solo root) ─────────

document.getElementById("deleteProductBtn").addEventListener("click", async () => {
  const id = document.getElementById("editingId").value;
  if (!id) return;
  if (!confirm("¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.")) return;

  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    document.getElementById("formError").textContent = error.message;
    return;
  }
  modal.style.display = "none";
  await loadAdminProducts();
});