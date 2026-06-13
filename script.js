const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
const hasLocomotive = Boolean(window.LocomotiveScroll);
let locoScroll;

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}

if (hasGsap && hasLocomotive) {
  locoScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    lerp: 0.08,
    smartphone: { smooth: true },
    tablet: { smooth: true },
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
      if (arguments.length) {
        locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
      }
      return locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed",
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();

    if (locoScroll) {
      locoScroll.scrollTo(target);
      return;
    }

    target.scrollIntoView({ behavior: "smooth" });
  });
});

if (hasGsap) {
  gsap.from(".profile-orbit", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        scroller: locoScroll ? "[data-scroll-container]" : window,
        start: "top 86%",
      },
    });
  });

  gsap.to(".hero__glow", {
    scale: 1.08,
    opacity: 0.72,
    scrollTrigger: {
      trigger: ".hero",
      scroller: locoScroll ? "[data-scroll-container]" : window,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  ScrollTrigger.addEventListener("refresh", () => {
    if (locoScroll) locoScroll.update();
  });
  ScrollTrigger.refresh();
}

function createFallbackParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.0008 + 0.00025,
  }));

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      if (particle.y < -0.02) particle.y = 1.02;
      ctx.beginPath();
      ctx.fillStyle = "rgba(117, 244, 255, 0.78)";
      ctx.arc(
        particle.x * window.innerWidth,
        particle.y * window.innerHeight,
        particle.size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function createThreeParticles() {
  const canvas = document.querySelector("#space");
  if (!window.THREE) {
    createFallbackParticles(canvas);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const geometry = new THREE.BufferGeometry();
  const count = 1200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 16;
    positions[i + 1] = (Math.random() - 0.5) * 16;
    positions[i + 2] = (Math.random() - 0.5) * 16;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x75f4ff,
    size: 0.025,
    transparent: true,
    opacity: 0.82,
  });

  const points = new THREE.Points(geometry, material);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.01, 12, 140),
    new THREE.MeshBasicMaterial({ color: 0x35c7ff, transparent: true, opacity: 0.32 })
  );

  scene.add(points, ring);
  camera.position.z = 5;

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.00035;
    ring.rotation.x += 0.003;
    ring.rotation.y += 0.004;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  animate();
}

createThreeParticles();
