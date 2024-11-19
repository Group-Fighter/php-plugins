class DynamicSPA {
	constructor(option = {}) {
		this.option = Object.assign({}, {
			container: "#app", // Default container
			routes: {}, // Default routes
			menuTagAttribute: "a", // Default event handler attribute
			eventAttribute: "event-handler", // Default event handler attribute
			htmlFail: "<h1>Error</h1><p>Failed to load content.</p>", // Default fail page HTML
			htmlNotFound: "<h1>404</h1><p>Page not found.</p>" // Default 404 page HTML
		}, option);
		this.routes = this.option.routes; // Parsing routes JSON
		this.cache = new Map(); // Cache for HTML and scripts
		this.loadedScripts = new Set(); // Scripts that have already been loaded
		this.currentPath = location.pathname; // Current active path
		this.init();
	}

	async init() {
		// Handle URL change (back/forward)
		window.addEventListener("popstate", () => this.handleNavigation(location.pathname));

		// Handle clicks on navigation links
		document.addEventListener("click", (e) => {
			const link = e.target.closest(`[${this.option.menuTagAttribute}]`);
			if (link) {
				const url = link.getAttribute('href') || link.getAttribute('data-url');
				if (url) {
					e.preventDefault();
					this.navigate(url);
				}
			}
		});

		// document.addEventListener("click", (e) => {
		// 	const link = e.target.closest('a');
		// 	if (link && link.href.startsWith(window.location.origin)) {
		// 		e.preventDefault();
		// 		console.log(link.pathname);

		// 		this.navigate(link.pathname);
		// 	}
		// });


		// Load the initial or selected page
		await this.handleNavigation(location.pathname);
	}

	// Navigate to a new page without reload
	async navigate(path) {
		history.pushState({}, "", path);
		this.removeScript()
		await this.handleNavigation(path);
	}

	addPage(path, { component, scripts = [] }) {
		if (!this.cache.has(path)) {
			this.routes[path] = { component, scripts };
		}
	}

	// Fungsi untuk navigasi ke halaman berdasarkan segment manual
	async navigateTo(path = '') {
		if (path) {
			this.navigate(path);
		} else {
			console.error(`path "${path}" not found.`);
		}
	}

	// Handle page loading based on the path
	async handleNavigation(path) {
		const route = this.routes[path] || this.routes["/404"]; // Get the route from JSON
		if (route) {
			// Remove event listeners from the previous page
			Promise.all([
				await this.removeEventListeners()
			]);

			// Check if the page is already cached
			if (this.cache.has(path)) {
				console.log(`Loaded from cache: ${path}`);
				const { html, scripts } = this.cache.get(path);
				Promise.all([
					this.renderContent(html),
					await this.loadScripts(scripts),
				])
			} else {
				console.log(`Loading from source: ${path}`);
				try {
					const { html, scripts } = await this.loadComponent(route.component);
					this.cache.set(path, { html, scripts });
					Promise.all([
						this.renderContent(html),
						await this.loadScripts(scripts),
					]);
				} catch (error) {
					console.error(`Error loading route: ${path}`, error);
					this.renderContent(this.option.htmlFail);
				}
			}
		} else {
			console.error(`Route not found: ${path}`);
			this.renderContent(this.option.htmlNotFound);
		}
	}

	// Load component HTML from URL or use inline HTML
	async loadComponent(component) {
		if (typeof component === "string" && component.startsWith("http")) {
			// If the component is a URL, fetch HTML from the URL
			const html = await this.fetchHTML(component);
			return { html, scripts: [] };
		} else {
			// If the component is inline HTML, use it directly
			return { html: component, scripts: [] };
		}
	}

	// Fetch HTML from a URL
	async fetchHTML(url) {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to fetch HTML from: ${url}`);
		return await response.text();
	}

	// Render HTML content into the container and execute JS
	renderContent(html) {
		const appContainer = document.querySelector(this.option.container);
		appContainer.innerHTML = html;
		this.afterRender(() => { });
		// Run page-specific JavaScript after rendering HTML
		this.runPageSpecificJS(html);
	}

	// Run JavaScript specific to the page
	async runPageSpecificJS(html) {
		const currentPath = location.pathname;

		// Check if scripts are defined for the current path
		if (this.routes[currentPath] && this.routes[currentPath].scripts) {
			const scripts = this.routes[currentPath].scripts;

			// Extract and run inline scripts from HTML
			const inlineScripts = this.extractInlineScripts(html);
			inlineScripts.forEach((script) => this.runInlineScript(script));

			await this.loadScripts(scripts); // Load external scripts
		}
	}

	// Extract inline scripts from HTML content
	extractInlineScripts(html) {
		const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/g;
		const scripts = [];
		let match;
		while ((match = scriptRegex.exec(html)) !== null) {
			scripts.push(match[1].trim());
		}
		return scripts;
	}

	// Load and execute external scripts
	async loadScripts(scripts) {
		for (let script of scripts) {
			await this.loadScript(script);
		}
	}

	removeScript() {
		const searchScript = document.body.querySelectorAll('script.script-link')
		if (searchScript) {
			searchScript.forEach(script => {
				this.loadedScripts.delete(script.src);
				script.remove()
			});
		}
	}
	// Load and execute a single external script
	async loadScript(src) {
		if (!this.loadedScripts) {
			this.loadedScripts = new Set();
		}

		// Cek apakah script sudah ada di Set atau DOM
		if (this.loadedScripts.has(src) || document.querySelector(`script[src="${src}"]`)) {
			// console.log(`Script ${src} is already loaded.`);
			return Promise.resolve(); // Kembali langsung jika sudah ada
		}

		// Buat elemen script baru
		const script = document.createElement("script");
		script.src = src;
		script.classList.add("script-link");
		script.async = false; // Load scripts secara berurutan
		document.body.appendChild(script);

		// Tambahkan script ke dalam Set setelah berhasil dimuat
		return new Promise((resolve, reject) => {
			script.onload = () => {
				this.loadedScripts.add(src);
				// console.log(`Script ${src} loaded successfully.`);
				resolve();
			};
			script.onerror = () => {
				console.error(`Failed to load script: ${src}`);
				reject(`Error loading script ${src}`);
			};
		});
	}

	// Run inline JavaScript
	runInlineScript(script) {
		try {
			// Using new Function() instead of eval() for better security
			new Function(script)(); // Executes the script
		} catch (error) {
			console.error("Error running inline script:", error);
		}
	}

	async getAllAttributes() {
		const pageElements = document.querySelectorAll(`[${this.option.eventAttribute}]`);
		const seenSelectors = new Set(); // Set untuk menyimpan selector yang sudah diproses
		const combinedSelectors = [];

		// Daftar kelas Bootstrap yang ingin dikecualikan
		const bootstrapClasses = this.classBootstrap();
		pageElements.forEach((el) => {
			// Ambil id, name, dan class dari elemen
			const id = el.id ? `#${el.id}` : "";
			const name = el.name ? `[name="${el.name}"]` : "";

			// Filter dan gabungkan kelas yang bukan kelas Bootstrap
			const classList = el.className
				? `.${el.className.split(" ").filter(className => !bootstrapClasses.includes(className)).join(", .")}`
				: "";

			// Gabungkan selector (id, name, class) ke dalam satu string
			const selector = [id, name, classList].filter(Boolean).join(", ");

			// Jika selector belum diproses, tambahkan ke Set dan simpan ke combinedSelectors
			if (!seenSelectors.has(selector) && selector) {
				seenSelectors.add(selector);
				combinedSelectors.push(selector);
			}
		});

		return { combinedSelectors, pageElements };
	}

	// Remove all event listeners from the previous page
	async removeEventListeners() {
		const { combinedSelectors, pageElements } = await this.getAllAttributes();

		pageElements.forEach((el) => {
			// Clone elemen untuk menghapus semua event listener
			const clone = el.cloneNode(true);
			el.parentNode.replaceChild(clone, el);
		});

		const events = [
			"click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout",
			"mouseenter", "mouseleave", "keydown", "keyup", "keypress", "change", "input",
			"submit", "focus", "blur", "resize", "scroll", "wheel", "contextmenu"
		];

		await Promise.all(
			combinedSelectors.map(async (selector) => {
				await Promise.all(
					events.map(async (event) => {
						// Hapus event listener untuk setiap kombinasi selector dan event
						$(document).off(event, selector);
					})
				);
			})
		);
		// $(document).off();
	}

	afterRender(fn) {
		fn();  // Call the passed function
	}

	classBootstrap() {
		const bootstrapClasses = [
			// Grid System
			'container',
			'container-fluid',
			'container-sm',
			'container-md',
			'container-lg',
			'container-xl',
			'container-xxl',
			'row',
			'col', 'col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6', 'col-7', 'col-8', 'col-9', 'col-10', 'col-11', 'col-12',
			'col-auto', 'col-sm', 'col-md', 'col-lg', 'col-xl', 'col-xxl',

			// Flexbox Utilities
			'd-flex', 'd-inline-flex', 'd-block', 'd-inline-block', 'd-none',
			'd-sm-none', 'd-md-none', 'd-lg-none', 'd-xl-none',
			'justify-content-center', 'justify-content-start', 'justify-content-end', 'justify-content-between', 'justify-content-around',
			'align-items-center', 'align-items-start', 'align-items-end', 'align-items-baseline', 'align-items-stretch',
			'align-self-auto', 'align-self-start', 'align-self-end', 'align-self-center',

			// Typography
			'text-left', 'text-center', 'text-right', 'text-justify',
			'text-muted', 'text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info', 'text-light', 'text-dark', 'text-body', 'text-white',
			'font-weight-light', 'font-weight-normal', 'font-weight-bold',
			'lead', 'display-1', 'display-2', 'display-3', 'display-4',
			'small', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'blockquote-footer',

			// Buttons
			'btn', 'btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-light', 'btn-dark', 'btn-link',
			'btn-lg', 'btn-sm', 'btn-block', 'btn-outline-primary', 'btn-outline-secondary', 'btn-outline-success', 'btn-outline-danger', 'btn-outline-warning',
			'active', 'disabled',

			// Alerts
			'alert', 'alert-primary', 'alert-secondary', 'alert-success', 'alert-danger', 'alert-warning', 'alert-info', 'alert-light', 'alert-dark', 'alert-dismissible',

			// Cards
			'card', 'card-body', 'card-title', 'card-text', 'card-header', 'card-footer', 'card-img-top', 'card-img-bottom', 'card-columns',

			// Forms
			'form-control', 'form-group', 'form-check', 'form-check-input', 'form-check-label', 'form-select', 'form-inline', 'form-text', 'form-floating',
			'input-group', 'input-group-prepend', 'input-group-append', 'input-group-text', 'input-group-lg', 'input-group-sm',
			'form-check-inline', 'form-check-input', 'form-check-label',

			// Modal
			'modal', 'modal-dialog', 'modal-dialog-centered', 'modal-content', 'modal-header', 'modal-body', 'modal-footer', 'modal-lg', 'modal-sm',
			'modal-backdrop', 'modal-backdrop.show',

			// Navs and Navbar
			'navbar', 'navbar-expand', 'navbar-expand-sm', 'navbar-expand-md', 'navbar-expand-lg', 'navbar-expand-xl', 'navbar-light', 'navbar-dark', 'bg-light', 'bg-dark', 'bg-primary', 'bg-secondary',
			'navbar-nav', 'navbar-brand', 'navbar-toggler', 'navbar-collapse', 'nav', 'nav-item', 'nav-link', 'nav-pills', 'nav-tabs', 'active', 'disabled',
			'navbar-fixed-top', 'navbar-fixed-bottom', 'sticky-top',

			// Grid - Offcanvas
			'offcanvas', 'offcanvas-start', 'offcanvas-end', 'offcanvas-body', 'offcanvas-header', 'offcanvas-title', 'offcanvas-footer',

			// Lists
			'list-group', 'list-group-item', 'list-group-item-action', 'list-group-item-primary', 'list-group-item-secondary', 'list-group-item-success', 'list-group-item-danger',
			'list-inline', 'list-inline-item',

			// Spacing
			'm-0', 'mt-0', 'mr-0', 'mb-0', 'ml-0', 'mx-0', 'my-0',
			'm-1', 'mt-1', 'mr-1', 'mb-1', 'ml-1', 'mx-1', 'my-1',
			'm-2', 'mt-2', 'mr-2', 'mb-2', 'ml-2', 'mx-2', 'my-2',
			'm-3', 'mt-3', 'mr-3', 'mb-3', 'ml-3', 'mx-3', 'my-3',
			'm-4', 'mt-4', 'mr-4', 'mb-4', 'ml-4', 'mx-4', 'my-4',
			'm-5', 'mt-5', 'mr-5', 'mb-5', 'ml-5', 'mx-5', 'my-5',
			'm-6', 'mt-6', 'mr-6', 'mb-6', 'ml-6', 'mx-6', 'my-6',
			'p-0', 'pt-0', 'pr-0', 'pb-0', 'pl-0', 'px-0', 'py-0',
			'p-1', 'pt-1', 'pr-1', 'pb-1', 'pl-1', 'px-1', 'py-1',
			'p-2', 'pt-2', 'pr-2', 'pb-2', 'pl-2', 'px-2', 'py-2',
			'p-3', 'pt-3', 'pr-3', 'pb-3', 'pl-3', 'px-3', 'py-3',
			'p-4', 'pt-4', 'pr-4', 'pb-4', 'pl-4', 'px-4', 'py-4',
			'p-5', 'pt-5', 'pr-5', 'pb-5', 'pl-5', 'px-5', 'py-5',
			'p-6', 'pt-6', 'pr-6', 'pb-6', 'pl-6', 'px-6', 'py-6',

			// Shadows
			'shadow', 'shadow-sm', 'shadow-lg', 'shadow-none',

			// Positioning
			'position-relative', 'position-absolute', 'position-fixed', 'position-sticky', 'top-0', 'bottom-0', 'start-0', 'end-0', 'translate-middle', 'position-absolute',

			// Overflow
			'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll', 'overflow-x-auto', 'overflow-y-auto',

			// Borders
			'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-0', 'border-1', 'border-2', 'border-3', 'border-4', 'border-5',
			'border-primary', 'border-secondary', 'border-success', 'border-danger', 'border-warning', 'border-info', 'border-light', 'border-dark',

			// Visibility
			'visible', 'invisible', 'opacity-0', 'opacity-50', 'opacity-100',

			// Spinners
			'spinner-border', 'spinner-grow', 'spinner-border-sm', 'spinner-grow-sm',

			// Tooltips and Popovers
			'tooltip', 'tooltip-inner', 'tooltip-arrow', 'popover', 'popover-header', 'popover-body',

			// Badges
			'badge', 'badge-primary', 'badge-secondary', 'badge-success', 'badge-danger', 'badge-warning', 'badge-info', 'badge-light', 'badge-dark',

			// Carousel
			'carousel', 'carousel-item', 'carousel-control-prev', 'carousel-control-next', 'carousel-indicators', 'carousel-caption', 'carousel-fade',

			// Grid Utilities
			'row-cols-1', 'row-cols-2', 'row-cols-3', 'row-cols-4', 'row-cols-5', 'row-cols-6', 'row-cols-sm-1', 'row-cols-sm-2', 'row-cols-md-3',

			// Others
			'container-sm', 'container-md', 'container-lg', 'container-xl', 'container-xxl',
			'position-fixed', 'position-absolute', 'position-relative', 'position-sticky',
			'sticky-top', 'fixed-top', 'fixed-bottom', 'top-0', 'bottom-0', 'start-0', 'end-0', 'translate-middle',

			// Visibility
			'visible', 'invisible', 'opacity-0', 'opacity-50', 'opacity-100'
		];
		return bootstrapClasses;
	}
}
