/* ===== ProyectoGeneration: Catálogo con localStorage (v3.2 ES5, namespaced) ===== */
(function(){
    'use strict';var LS_KEY='pg_catalog_v3',DOC=document;
    function $id(i){
        return DOC.getElementById(i)}
    function $qs(s,r){
        return(r||DOC).querySelector(s)}
    function uid(){
        try{
            if(window.crypto&&typeof window.crypto.randomUUID==='function')
        return window.crypto.randomUUID()
    }
        catch(e){}
        return'id-'+Math.random().toString(36).slice(2)+(new Date().getTime())
    }
        function currency(n){
            try{
                return new Intl.NumberFormat('es-MX',{
                    style:'currency',currency:'MXN'}).format(Number(n||0))}
                    catch(e){var x=Number(n||0);
                        return 'MXN $'+x.toFixed(2)
                    }
                }
                        function readDefaultSeed(){
                            var el=$id('pg-default-catalog');
                            if(!el)
                                return[];
                            try{
                                return JSON.parse((el.textContent||'').trim())||[]}
                            catch(e){
                                return[]
                            }
                        }
                        // Merge the default seed into localStorage so the 10 baseline items always appear
                        function mergeSeedIntoLocalStorage(){
                            var current=[];
                            try{
                                var raw=localStorage.getItem(LS_KEY);
                                if(raw) current=JSON.parse(raw)||[];
                            }catch(e){}
                            var seed=readDefaultSeed();
                            if(!seed||!seed.length){
                                return current; // nothing to merge
                            }
                            var index={}, i, k;
                            for(i=0;i<current.length;i++){
                                k=(current[i]&& (current[i].id||current[i].sku)) || ('cur-'+i);
                                index[k]=current[i];
                            }
                            var changed=false;
                            for(i=0;i<seed.length;i++){
                                var s=seed[i]||{};
                                k=(s.id||s.sku||('seed-'+i));
                                if(!index[k]){ // add missing baseline item
                                    index[k]=s;
                                    changed=true;
                                }
                            }
                            if(!changed){
                                return current;
                            }
                            var merged=[];
                            for(var key in index){
                                if(Object.prototype.hasOwnProperty.call(index,key)) merged.push(index[key]);
                            }
                            try{ localStorage.setItem(LS_KEY,JSON.stringify(merged)); }catch(e){}
                            return merged;
                        }
                            function getCatalog(){
                                try{
                                    var raw=localStorage.getItem(LS_KEY);
                                    if(raw)
                                        return JSON.parse(raw)
                                    }
                                    catch(e){}
                                    return readDefaultSeed()
                                }
                                // Expose read-only getter to other scripts (e.g., protesis.js)
                                try{ window.pgGetCatalog=getCatalog; }catch(e){}
                                
                                function addToCartViaProtesis(id){
                                    // Siempre delegar al handler oficial para mantener sincronizado el carrito en memoria
                                    try{
                                        if(window.agregarAlCarrito){
                                            window.agregarAlCarrito(id);
                                            return;
                                        }
                                    }catch(e){
                                        console.error('❌ Error en addToCartViaProtesis -> agregarAlCarrito:', e);
                                    }
                                    // Fallback: si no existe el handler, escribir directamente en localStorage
                                    try{
                                        var list=getCatalog();
                                        var p=null; for(var i=0;i<list.length;i++){ if(String(list[i].id)===String(id)){ p=list[i]; break; } }
                                        if(!p) return;
                                        var carrito=[]; try{ carrito=JSON.parse(localStorage.getItem('carritoPatitas')||'[]'); }catch(e){}
                                        var exist=null; for(var j=0;j<carrito.length;j++){ if(String(carrito[j].id)===String(id)){ exist=carrito[j]; break; } }
                                        if(exist){ exist.cantidad+=1; }
                                        else{
                                            var item = {
                                                id: p.id,
                                                nombreProtesis: p.name || p.nombreProtesis || '(Sin nombre)',
                                                precio: Number(p.price || p.precio || 0),
                                                cantidad: 1,
                                                imagenes: [p.image || p.imagen || 'assets/images/placeholder.png'],
                                                imagen: p.image || p.imagen || 'assets/images/placeholder.png',
                                                sku: p.sku || ''
                                            };
                                            carrito.push(item);
                                        }
                                        localStorage.setItem('carritoPatitas', JSON.stringify(carrito));
                                        if(window.mostrarMensaje){ window.mostrarMensaje('Agregado al carrito: '+(p.name||'(Sin nombre)'),'success'); }
                                    }catch(e){
                                        console.error('❌ Fallback addToCartViaProtesis error:', e);
                                    }
                                }
                                    function saveCatalog(a){
                                        try{
                                            localStorage.setItem(LS_KEY,JSON.stringify(a))
                                        }
                                        catch(e){}
                                    }
                                        function upsertItem(item){
                                            var d=getCatalog(),i,f=-1;
                                            for(i=0;i<d.length;i++){
                                                var p=d[i];
                                                if((p.id&&item.id&&String(p.id)===String(item.id))||(p.sku&&item.sku&&p.sku===item.sku)){
                                                    f=i;
                                                    break
                                                }
                                            }
                                            if(f>=0){
                                                var b=d[f];
                                                for(var k in item)
                                                    if(item.hasOwnProperty(k))b[k]=item[k];
                                                d[f]=b
                                            }
                                            else{
                                                // Asignar id numérico único
                                                var allIds = [];
                                                for(var j=0;j<d.length;j++){
                                                    var pid = d[j].id;
                                                    if(!isNaN(Number(pid))) allIds.push(Number(pid));
                                                }
                                                if(window.todosLosProductos){
                                                    for(var j=0;j<window.todosLosProductos.length;j++){
                                                        var pid = window.todosLosProductos[j].id;
                                                        if(!isNaN(Number(pid))) allIds.push(Number(pid));
                                                    }
                                                }
                                                var maxId = allIds.length ? Math.max.apply(null, allIds) : 0;
                                                item.id = maxId + 1;
                                                d.push(item);
                                            }
                                            saveCatalog(d);
                                            try{ applyFiltersAndRender(); }catch(ex){ render(); }
                                                        }
                                                            function deleteItem(id){
                                                                var d=getCatalog(),o=[];
                                                                for(var i=0;
                                                                    i<d.length;i++){
                                                                        if(d[i].id!==id)o.push(d[i])
                                                                        }
                                                                    saveCatalog(o);
                                                                    try{ applyFiltersAndRender(); }catch(ex){ render(); }
                                                                }
                                                                    function ensureContainer(){
                                                                        var g=$id('pg-catalog-grid')||$qs('[data-pg-catalog-grid]');
                                                                        if(!g){
                                                                            var c=DOC.createElement('section');
                                                                        c.className='container';
                                                                        c.style.marginTop='2rem';
                                                                        var h2=DOC.createElement('h2');
                                                                        h2.className='section-title';
                                                                        h2.appendChild(DOC.createTextNode('Nuestras Prótesis'));
                                                                        g=DOC.createElement('div');
                                                                        g.id='pg-catalog-grid';
                                                                        g.className='protesis-grid';
                                                                        c.appendChild(h2);
                                                                        c.appendChild(g);
                                                                        var a=$qs('#catalog-root')||DOC.body;
                                                                        a.appendChild(c)
                                                                    }
                                                                        return g
                                                                    }
                                                                        function makeInput(id,t,p){
                                                                            var i=DOC.createElement('input');
                                                                            i.id=id;
                                                                            if(t)i.type=t;
                                                                            if(p)i.placeholder=p;
                                                                            return i
                                                                        }
                                                                            function makeLabel(t){
                                                                                var l=DOC.createElement('label');
                                                                                l.appendChild(DOC.createTextNode(t));
                                                                                return l}
                                                                                function wrapDiv(ch,cl){
                                                                                    var d=DOC.createElement('div');
                                                                                    if(cl)d.className=cl;
                                                                                    for(var i=0;
                                                                                        i<ch.length;
                                                                                        i++)d.appendChild(ch[i]);
                                                                                        return d
                                                                                    }
                                                                                        function ensureAdminPanel(){
                                                                                            var p=$id('pg-admin-panel');
                                                                                            if(p)
                                                                                                return p;
                                                                                            p=DOC.createElement('section');
                                                                                            p.id='pg-admin-panel';
                                                                                            p.className='container';
                                                                                            var h3=DOC.createElement('h3');
                                                                                            h3.appendChild(DOC.createTextNode('Administrar catálogo (localStorage)'));
                                                                                            p.appendChild(h3);
                                                                                            var f=DOC.createElement('form');
                                                                                            f.id='pg-add-item-form';
                                                                                            f.className='pg-form';
                                                                                            f.setAttribute('autocomplete','off');
                                                                                            var hid=makeInput('pg-item-id','hidden');
                                                                                            var nameI=makeInput('pg-item-name');
                                                                                            nameI.required=true;
                                                                                            var skuI=makeInput('pg-item-sku');
                                                                                            skuI.required=true;
                                                                                            var catI=makeInput('pg-item-category',null,'rodilla, codo, etc.');
                                                                                            var priceI=makeInput('pg-item-price','number');
                                                                                            priceI.step='0.01';
                                                                                            priceI.required=true;
                                                                                            var stockI=makeInput('pg-item-stock','number');
                                                                                            stockI.step='1';
                                                                                            stockI.min='0';
                                                                                            stockI.value='0';
                                                                                            var imgI=makeInput('pg-item-image',null,'assets/img/protesis/rodilla01.jpg');
                                                                                            var descT=DOC.createElement('textarea');
                                                                                            descT.id='pg-item-description';
                                                                                            descT.rows=2;
                                                                                            var saveB=DOC.createElement('button');
                                                                                            saveB.type='submit';
                                                                                            saveB.id='pg-save-item-btn';
                                                                                            saveB.appendChild(DOC.createTextNode('Guardar'));
                                                                                            var resetB=DOC.createElement('button');
                                                                                            resetB.type='button';
                                                                                            resetB.id='pg-reset-form-btn';
                                                                                            resetB.appendChild(DOC.createTextNode('Limpiar'));
                                                                                            var exportB=DOC.createElement('button');
                                                                                            exportB.type='button';
                                                                                            exportB.id='pg-export-btn';
                                                                                            exportB.appendChild(DOC.createTextNode('Exportar (.json)'));
                                                                                            var importLabel=makeLabel('Importar (.json): ');
                                                                                            var importI=makeInput('pg-import-input','file');
                                                                                            importI.accept='application/json';
                                                                                            importLabel.style.marginLeft='1rem';
                                                                                            importLabel.appendChild(importI);
                                                                                            f.appendChild(hid);
                                                                                            f.appendChild(wrapDiv([makeLabel('Nombre'),nameI],''));
                                                                                            f.appendChild(wrapDiv([makeLabel('SKU'),skuI],''));
                                                                                            f.appendChild(wrapDiv([makeLabel('Categoría'),catI],''));
                                                                                            f.appendChild(wrapDiv([makeLabel('Precio (MXN)'),priceI],''));
                                                                                            f.appendChild(wrapDiv([makeLabel('Stock'),stockI],''));
                                                                                            f.appendChild(wrapDiv([makeLabel('Imagen (URL)'),imgI],''));
                                                                                            var descW=wrapDiv([makeLabel('Descripción'),descT],'pg-full');
                                                                                            f.appendChild(descW);
                                                                                            var actions=wrapDiv([saveB,resetB,exportB,importLabel],'pg-full');
                                                                                            f.appendChild(actions);
                                                                                            p.appendChild(f);
                                                                                            DOC.body.appendChild(p);
                                                                                            return p
                                                                                        }
                                                                                            function createCard(p){
                                                                                                var a=DOC.createElement('article');
                                                                                                a.className='protesis-card';
                                                                                                a.setAttribute('data-id',p.id||'');
                                                                                                
                                                                                                // Image container
                                                                                                var imgContainer=DOC.createElement('div');
                                                                                                imgContainer.className='protesis-image-container';
                                                                                                var img=DOC.createElement('img');
                                                                                                img.className='protesis-image';
                                                                                                img.src=p.image||'assets/images/placeholder.png';
                                                                                                img.alt=(p.name||'').replace(/\"/g,'&quot;');
                                                                                                img.addEventListener('error',function(){
                                                                                                    this.src='assets/images/placeholder.png'
                                                                                                });
                                                                                                
                                                                                                // Stock badge
                                                                                                var stockBadge=DOC.createElement('span');
                                                                                                var stock=isFinite(p.stock)?p.stock:null;
                                                                                                if(stock===null){
                                                                                                    stockBadge.className='badge-stock';
                                                                                                    stockBadge.appendChild(DOC.createTextNode('Servicio'))
                                                                                                }else if(stock===0){
                                                                                                    stockBadge.className='badge-stock no-stock';
                                                                                                    stockBadge.appendChild(DOC.createTextNode('Agotado'))
                                                                                                }else if(stock<=5){
                                                                                                    stockBadge.className='badge-stock low-stock';
                                                                                                    stockBadge.appendChild(DOC.createTextNode('¡Últimos '+stock+'!'))
                                                                                                }else{
                                                                                                    stockBadge.className='badge-stock';
                                                                                                    stockBadge.appendChild(DOC.createTextNode(stock+' disponibles'))
                                                                                                }
                                                                                                imgContainer.appendChild(img);
                                                                                                imgContainer.appendChild(stockBadge);
                                                                                                
                                                                                                // Info container
                                                                                                var infoDiv=DOC.createElement('div');
                                                                                                infoDiv.className='protesis-info';
                                                                                                
                                                                                                var h3=DOC.createElement('h3');
                                                                                                h3.className='protesis-name';
                                                                                                h3.appendChild(DOC.createTextNode(p.name||'(Sin nombre)'));
                                                                                                
                                                                                                var desc=DOC.createElement('p');
                                                                                                desc.className='protesis-description';
                                                                                                desc.appendChild(DOC.createTextNode(p.description||''));
                                                                                                
                                                                                                // Details container
                                                                                                var details=DOC.createElement('div');
                                                                                                details.className='protesis-details';
                                                                                                var priceSpan=DOC.createElement('span');
                                                                                                priceSpan.className='protesis-price';
                                                                                                priceSpan.appendChild(DOC.createTextNode(currency(p.price)));
                                                                                                var skuSpan=DOC.createElement('span');
                                                                                                skuSpan.className='protesis-sku';
                                                                                                skuSpan.appendChild(DOC.createTextNode('Talla: Estándar'));
                                                                                                details.appendChild(priceSpan);
                                                                                                details.appendChild(skuSpan);
                                                                                                
                                                                                                // SKU paragraph
                                                                                                var skuP=DOC.createElement('p');
                                                                                                skuP.className='protesis-sku';
                                                                                                skuP.appendChild(DOC.createTextNode('SKU: '+(p.sku||'-')));
                                                                                                
                                                                                                // Add to cart button (cliente)
                                                                                                var addB = DOC.createElement('button');
                                                                                                addB.className = 'btn-add-cart';
                                                                                                var noStock = (p.stock === 0 || p.stock === null);
                                                                                                if (noStock) {
                                                                                                addB.disabled = true;
                                                                                                addB.innerHTML = `
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-x-circle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                                                                                    Sin Stock
                                                                                                `;
                                                                                                } else {
                                                                                                addB.innerHTML = `
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-shopping-cart" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/></svg>
                                                                                                    Agregar al Carrito
                                                                                                `;
                                                                                                }
                                                                                                addB.addEventListener('click', function() { addToCartViaProtesis(p.id); });

                                                                                                // Admin buttons container (solo visible en modo admin)
                                                                                                var btnW=DOC.createElement('div');
                                                                                                btnW.className='pg-admin-buttons';
                                                                                                btnW.style.cssText='display:flex;gap:0.5rem;margin-top:1rem;';
                                                                                                var eB=DOC.createElement('button');
                                                                                                eB.className='pg-btn-edit';
                                                                                                eB.setAttribute('data-id',p.id||'');
                                                                                                eB.appendChild(DOC.createTextNode('✏️ Editar'));
                                                                                                var dB=DOC.createElement('button');
                                                                                                dB.className='pg-btn-delete';
                                                                                                dB.setAttribute('data-id',p.id||'');
                                                                                                dB.appendChild(DOC.createTextNode('🗑️ Eliminar'));
                                                                                                btnW.appendChild(eB);
                                                                                                btnW.appendChild(dB);
                                                                                                
                                                                                                infoDiv.appendChild(h3);
                                                                                                infoDiv.appendChild(desc);
                                                                                                infoDiv.appendChild(details);
                                                                                                infoDiv.appendChild(skuP);
                                                                                                infoDiv.appendChild(addB);
                                                                                                infoDiv.appendChild(btnW);
                                                                                                
                                                                                                a.appendChild(imgContainer);
                                                                                                a.appendChild(infoDiv);
                                                                                                    eB.addEventListener('click',function(){
                                                                                                        var id=this.getAttribute('data-id');
                                                                                                        var list=getCatalog(),i,f=null;
                                                                                                        for(i=0;i<list.length;i++)
                                                                                                            if(list[i].id===id){
                                                                                                                f=list[i];
                                                                                                                break
                                                                                                            }
                                                                                                                if(!f)
                                                                                                                    return;
                                                                                                                fillForm(f);
                                                                                                                setAdminVisibility(true);
                                                                                                                var ap=$id('pg-admin-panel');
                                                                                                                if(ap&&ap.offsetTop!=null){
                                                                                                                    try{
                                                                                                                        window.scrollTo({
                                                                                                                            top:ap.offsetTop-20,behavior:'smooth'
                                                                                                                        }
                                                                                                                    )
                                                                                                                }
                                                                                                                catch(e){
                                                                                                                    window.scrollTo(0,ap.offsetTop-20)
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                                    dB.addEventListener('click',function(){
                                                                                                        var id=this.getAttribute('data-id');
                                                                                                        if(confirm('¿Eliminar este artículo?'))
                                                                                                            deleteItem(id)
                                                                                                        }
                                                                                                    );
                                                                                                    return a
                                                                                                }
                                                                                                function render(list){
                                                                                                    var d=(list&&list.length!=null)?list:getCatalog(),g=ensureContainer();
                                                                                                    while(g.firstChild)g.removeChild(g.firstChild);
                                                                                                    if(!d.length){
                                                                                                        var p=DOC.createElement('p');
                                                                                                        p.appendChild(DOC.createTextNode('No hay artículos en el catálogo.'));
                                                                                                        g.appendChild(p);
                                                                                                        // sync counter label even when empty
                                                                                                        var cnt=$id('productsCount');
                                                                                                        if(cnt){ cnt.textContent='Mostrando 0 productos'; }
                                                                                                        return}
                                                                                                        for(var i=0;i<d.length;i++)g.appendChild(createCard(d[i])
                                                                                                        );
                                                                                                        // Sync external counter label to match PG catalog
                                                                                                        var cnt2=$id('productsCount');
                                                                                                        if(cnt2){
                                                                                                            var n=d.length;
                                                                                                            cnt2.textContent='Mostrando '+n+' producto'+(n!==1?'s':'');
                                                                                                        }
                                                                                                        }
                                                                                                    // ===== Filtros y búsqueda (PG Catalog) =====
                                                                                                    function getFilterControls(){
                                                                                                        return {
                                                                                                            search: ($id('searchBox')&&$id('searchBox').value||'').toLowerCase(),
                                                                                                            size: ($id('filterSize')&&$id('filterSize').value)||'all',
                                                                                                            sort: ($id('sortBy')&&$id('sortBy').value)||'name'
                                                                                                        }
                                                                                                    }
                                                                                                    function applyFilters(list){
                                                                                                        var c=list.slice(0);
                                                                                                        var f=getFilterControls();
                                                                                                        // Búsqueda por nombre, descripción o SKU
                                                                                                        if(f.search){
                                                                                                            c=c.filter(function(p){
                                                                                                                var name=(p.name||'').toLowerCase();
                                                                                                                var desc=(p.description||'').toLowerCase();
                                                                                                                var sku=(p.sku||'').toLowerCase();
                                                                                                                return name.indexOf(f.search)>-1 || desc.indexOf(f.search)>-1 || sku.indexOf(f.search)>-1;
                                                                                                            });
                                                                                                        }
                                                                                                        // Filtro por talla: si el ítem no tiene talla, no lo excluimos
                                                                                                        if(f.size && f.size!=='all'){
                                                                                                            c=c.filter(function(p){
                                                                                                                var sz=(p.size||'');
                                                                                                                return !sz || sz===f.size;
                                                                                                            });
                                                                                                        }
                                                                                                        // Ordenamiento
                                                                                                        switch(f.sort){
                                                                                                            case 'price-asc':
                                                                                                                c.sort(function(a,b){ return (a.price||0)-(b.price||0); });
                                                                                                                break;
                                                                                                            case 'price-desc':
                                                                                                                c.sort(function(a,b){ return (b.price||0)-(a.price||0); });
                                                                                                                break;
                                                                                                            case 'stock':
                                                                                                                c.sort(function(a,b){ return (isFinite(b.stock)?b.stock:0)-(isFinite(a.stock)?a.stock:0); });
                                                                                                                break;
                                                                                                            case 'name':
                                                                                                            default:
                                                                                                                c.sort(function(a,b){ return (a.name||'').localeCompare(b.name||''); });
                                                                                                        }
                                                                                                        return c;
                                                                                                    }
                                                                                                    function applyFiltersAndRender(){
                                                                                                        var base=getCatalog();
                                                                                                        if($id('searchBox')||$id('filterSize')||$id('sortBy')){
                                                                                                            var filtered=applyFilters(base);
                                                                                                            render(filtered);
                                                                                                        }else{
                                                                                                            render(base);
                                                                                                        }
                                                                                                    }
                                                                                                    function fillForm(p){
                                                                                                        $id('pg-item-id').value=p.id||'';
                                                                                                        $id('pg-item-name').value=p.name||'';
                                                                                                        $id('pg-item-sku').value=p.sku||'';
                                                                                                        $id('pg-item-category').value=p.category||'';
                                                                                                        $id('pg-item-price').value=(p.price!=null?p.price:'');
                                                                                                        $id('pg-item-stock').value=(p.stock!=null?p.stock:0);
                                                                                                        $id('pg-item-image').value=p.image||'';
                                                                                                        $id('pg-item-description').value=p.description||'';
                                                                                                        $id('pg-save-item-btn').textContent='Actualizar'
                                                                                                    }
                                                                                                    function clearForm(){
                                                                                                        var ids=['pg-item-id',
                                                                                                            'pg-item-name',
                                                                                                            'pg-item-sku',
                                                                                                            'pg-item-category',
                                                                                                            'pg-item-price',
                                                                                                            'pg-item-stock',
                                                                                                            'pg-item-image',
                                                                                                            'pg-item-description'];
                                                                                                            for(var i=0;i<ids.length;i++){
                                                                                                                var el=$id(ids[i]);
                                                                                                                if(!el)continue;
                                                                                                                el.value=(ids[i]==='pg-item-stock')?0:''
                                                                                                            }
                                                                                                            $id('pg-save-item-btn').textContent='Guardar'
                                                                                                        }
                                                                                                        function bindForm(){
                                                                                                            var form=$id('pg-add-item-form');
                                                                                                            if(!form)return;
                                                                                                            form.addEventListener('submit',function(e){
                                                                                                                e.preventDefault();
                                                                                                                var price=parseFloat($id('pg-item-price').value);
                                                                                                                var stock=parseInt($id('pg-item-stock').value||'0',10);
                                                                                                                if(!$id('pg-item-name').value.trim()||!$id('pg-item-sku').value.trim()||isNaN(price)){
                                                                                                                    alert('Nombre, SKU y Precio son obligatorios.');
                                                                                                                    return
                                                                                                                }
                                                                                                                var item={
                                                                                                                    id:$id('pg-item-id').value||uid(),
                                                                                                                    name:$id('pg-item-name').value.trim(),
                                                                                                                    sku:$id('pg-item-sku').value.trim(),
                                                                                                                    category:$id('pg-item-category').value.trim(),
                                                                                                                    price:price,
                                                                                                                    stock:isNaN(stock)?0:stock,
                                                                                                                    image:$id('pg-item-image').value.trim(),
                                                                                                                    description:$id('pg-item-description').value.trim(),
                                                                                                                    updatedAt:(new Date()).toISOString()
                                                                                                                };
                                                                                                                    upsertItem(item);
                                                                                                                    clearForm();
                                                                                                                    try{ applyFiltersAndRender(); }catch(ex){}
                                                                                                                });
                                                                                                                var resetBtn=$id('pg-reset-form-btn');
                                                                                                                if(resetBtn)resetBtn.addEventListener('click',clearForm);
                                                                                                                var exportBtn=$id('pg-export-btn');
                                                                                                                if(exportBtn)exportBtn.addEventListener('click',function(){
                                                                                                                    var data=getCatalog();
                                                                                                                    var blob=new Blob([JSON.stringify(data,null,2)],{
                                                                                                                        type:'application/json'
                                                                                                                    });
                                                                                                                    var a=DOC.createElement('a');
                                                                                                                    a.href=URL.createObjectURL(blob);
                                                                                                                    a.download='catalogo_proyectoGeneration.json';
                                                                                                                    DOC.body.appendChild(a);
                                                                                                                    a.click();
                                                                                                                    setTimeout(function(){
                                                                                                                        try{
                                                                                                                            URL.revokeObjectURL(a.href);
                                                                                                                            DOC.body.removeChild(a)
                                                                                                                        }
                                                                                                                        catch(e){}},0)
                                                                                                                    });
                                                                                                                    var importInput=$id('pg-import-input');
                                                                                                                    if(importInput)importInput.addEventListener('change',function(ev){
                                                                                                                        var file=ev.target&&ev.target.files&&ev.target.files[0];
                                                                                                                        if(!file)
                                                                                                                            return;
                                                                                                                        var reader=new FileReader();
                                                                                                                        reader.onload=function(){
                                                                                                                            try{
                                                                                                                                var incoming=JSON.parse(reader.result);
                                                                                                                                if(Object.prototype.toString.call(incoming)!=='[object Array]'){
                                                                                                                                    throw new Error('JSON inválido: se esperaba un arreglo de artículos.')
                                                                                                                                }
                                                                                                                                var current=getCatalog();
                                                                                                                                var index={},i,key;
                                                                                                                                for(i=0;i<current.length;i++){
                                                                                                                                    key=current[i].id||current[i].sku||uid();
                                                                                                                                    index[key]=current[i]
                                                                                                                                }
                                                                                                                                for(i=0;i<incoming.length;i++){
                                                                                                                                    var q=incoming[i];
                                                                                                                                    key=q.id||q.sku||uid();
                                                                                                                                    if(index[key]){
                                                                                                                                        var base=index[key];
                                                                                                                                        for(var k in q)
                                                                                                                                            if(q.hasOwnProperty(k))
                                                                                                                                                base[k]=q[k];
                                                                                                                                            index[key]=base
                                                                                                                                        }
                                                                                                                                        else{
                                                                                                                                            if(!q.id)q.id=key;
                                                                                                                                            index[key]=q}
                                                                                                                                        }
                                                                                                                                        var merged=[];
                                                                                                                                        for(var k2 in index)
                                                                                                                                            if(Object.prototype.hasOwnProperty.call(index,k2))
                                                                                                                                                merged.push(index[k2]);
                                                                                                                                            saveCatalog(merged);
                                                                                                                                            try{ applyFiltersAndRender(); }catch(ex){ render(); }
                                                                                                                                            alert('Importación completa. Total artículos: '+merged.length)
                                                                                                                                        }
                                                                                                                                        catch(err){
                                                                                                                                            alert('No se pudo importar: '+(err&&err.message?err.message:err))
                                                                                                                                        }
                                                                                                                                        finally{
                                                                                                                                            try{
                                                                                                                                                importInput.value=''
                                                                                                                                            }
                                                                                                                                            catch(e){}
                                                                                                                                        }
                                                                                                                                    };
                                                                                                                                    reader.onerror=function(){
                                                                                                                                        alert('No se pudo leer el archivo de importación.')
                                                                                                                                    };
                                                                                                                                    reader.readAsText(file)
                                                                                                                                }
                                                                                                                            )
                                                                                                                        }
                                                                                                                        function setAdminVisibility(show){
                                                                                                                            var p=ensureAdminPanel();
                                                                                                                            p.style.display=show?'block':'none';
                                                                                                                            if(show){
                                                                                                                                DOC.body.classList.add('pg-admin-mode')
                                                                                                                            }else{
                                                                                                                                DOC.body.classList.remove('pg-admin-mode')
                                                                                                                            }
                                                                                                                        }
                                                                                                                        document.addEventListener('DOMContentLoaded',function(){
                                                                                                                            var s=document.location.search||'';
                                                                                                                            var pr={};
                                                                                                                            if(s.indexOf('?')===0)
                                                                                                                                s=s.slice(1);
                                                                                                                            var parts=s.split('&');
                                                                                                                            for(var i=0;i<parts.length;i++){
                                                                                                                                if(!parts[i])
                                                                                                                                    continue;
                                                                                                                                var kv=parts[i].split('=');
                                                                                                                                pr[decodeURIComponent(kv[0]||'')]=decodeURIComponent(kv[1]||'')
                                                                                                                            }
                                                                                                                            // Always merge seed so the baseline 10 items are present
                                                                                                                            mergeSeedIntoLocalStorage();
                                                                                                                                ensureContainer();
                                                                                                                                ensureAdminPanel();
                                                                                                                                setAdminVisibility(pr['admin']==='1');
                                                                                                                                bindForm();
                                                                                                                                // Conectar filtros/búsqueda si existen
                                                                                                                                var sb=$id('searchBox');
                                                                                                                                var fs=$id('filterSize');
                                                                                                                                var so=$id('sortBy');
                                                                                                                                if(sb) sb.addEventListener('input', applyFiltersAndRender);
                                                                                                                                if(fs) fs.addEventListener('change', applyFiltersAndRender);
                                                                                                                                if(so) so.addEventListener('change', applyFiltersAndRender);
                                                                                                                                applyFiltersAndRender();
                                                                                                                                document.addEventListener('keydown',function(e){
                                                                                                                                    var k=e&&(e.key||e.keyCode);
                                                                                                                                    if(e.ctrlKey&&e.altKey&&(k==='a'||k==='A'||k===65)){
                                                                                                                                        var panel=$id('pg-admin-panel');
                                                                                                                                        var visible=panel&&panel.style.display!=='none';
                                                                                                                                        setAdminVisibility(!visible)
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            )
                                                                                                                        }
                                                                                                                    )
                                                                                                                }
                                                                                                            )
                                                                                                            (
                                                                                                                
                                                                                                            );