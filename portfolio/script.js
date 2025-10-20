// Grab DOM elements
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const cursor = document.getElementById("cursor");
const interactiveElements = document.querySelectorAll("a, button, .skill-card");
const yearEl = document.getElementById("year");
const sections = document.querySelectorAll(".section");
const typedContainer = document.querySelector(".intro__tagline");
const typedText = document.querySelector(".typed-text");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

// Responsive navigation toggle
navToggle?.addEventListener("click", () => {
	navLinks.classList.toggle("open");
	navToggle.classList.toggle("open");
});

// Close nav on link click (mobile)
navLinks?.addEventListener("click", (event) => {
	if (event.target.tagName === "A") {
		navLinks.classList.remove("open");
		navToggle.classList.remove("open");
	}
});

// Smooth reveal animations
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) entry.target.classList.add("visible");
		});
	},
	{ threshold: 0.2 }
);

sections.forEach((section) => {
	section.classList.add("fade-in");
	observer.observe(section);
});

// Typed text effect
if (typedContainer) {
	const words = JSON.parse(typedContainer.dataset.words || "[]");
	let wordIndex = 0;
	let charIndex = 0;
	let deleting = false;
	const typingSpeed = 100;
	const deletingSpeed = 50;
	const delayBetweenWords = 1400;

	const type = () => {
		if (!words.length) return;
		const currentWord = words[wordIndex];

		if (!deleting) {
			typedText.textContent = currentWord.substring(0, charIndex + 1);
			charIndex++;
			if (charIndex === currentWord.length) {
				deleting = true;
				setTimeout(type, delayBetweenWords);
				return;
			}
		} else {
			typedText.textContent = currentWord.substring(0, charIndex - 1);
			charIndex--;
			if (charIndex === 0) {
				deleting = false;
				wordIndex = (wordIndex + 1) % words.length;
			}
		}
		setTimeout(type, deleting ? deletingSpeed : typingSpeed);
	};
	type();
}

// Custom cursor
document.addEventListener("mousemove", (event) => {
	cursor.style.top = `${event.clientY}px`;
	cursor.style.left = `${event.clientX}px`;
});

interactiveElements.forEach((el) => {
	el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
	el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
});

// Ripple effect on buttons
document.querySelectorAll(".btn-ripple").forEach((btn) => {
	btn.addEventListener("click", (event) => {
		const rect = btn.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		btn.style.setProperty("--ripple-x", `${x}px`);
		btn.style.setProperty("--ripple-y", `${y}px`);
		const ripple = document.createElement("span");
		ripple.className = "ripple";
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		btn.appendChild(ripple);
		setTimeout(() => ripple.remove(), 600);
	});
});

// Update footer year
yearEl.textContent = new Date().getFullYear();

// Particle network animation
const particles = [];
const particleCount = 70;

const resizeCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

const randomRange = (min, max) => Math.random() * (max - min) + min;

class Particle {
	constructor() {
		this.reset();
	}
	reset() {
		this.x = randomRange(0, canvas.width);
		this.y = randomRange(0, canvas.height);
		this.vx = randomRange(-0.4, 0.4);
		this.vy = randomRange(-0.4, 0.4);
		this.size = randomRange(1, 2.5);
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
			this.reset();
		}
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = "rgba(240, 199, 94, 0.7)";
		ctx.shadowColor = "rgba(240, 199, 94, 0.9)";
		ctx.shadowBlur = 12;
		ctx.fill();
		ctx.closePath();
		ctx.shadowBlur = 0;
	}
}

const drawLines = () => {
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const dx = particles[i].x - particles[j].x;
			const dy = particles[i].y - particles[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < 140) {
				const alpha = 1 - distance / 140;
				ctx.strokeStyle = `rgba(240, 199, 94, ${alpha * 0.2})`;
				ctx.lineWidth = alpha * 0.8;
				ctx.beginPath();
				ctx.moveTo(particles[i].x, particles[i].y);
				ctx.lineTo(particles[j].x, particles[j].y);
				ctx.stroke();
			}
		}
	}
};

const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach((particle) => {
		particle.update();
		particle.draw();
	});
	drawLines();
	requestAnimationFrame(animate);
};

// Initialize particles
const initParticles = () => {
	particles.length = 0;
	for (let i = 0; i < particleCount; i++) {
		particles.push(new Particle());
	}
};

resizeCanvas();
initParticles();
animate();

window.addEventListener("resize", () => {
	resizeCanvas();
	initParticles();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", (event) => {
		const targetId = anchor.getAttribute("href").slice(1);
		const target = document.getElementById(targetId);
		if (target) {
			event.preventDefault();
			target.scrollIntoView({ behavior: "smooth" });
		}
	});
});
