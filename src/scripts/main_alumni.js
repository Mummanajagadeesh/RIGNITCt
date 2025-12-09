/* Header animation */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
observer.observe(document.querySelector('#people .people-header'));

/* Alumni company logos */
const companySlider = document.getElementById('companySlider');
const companyImages = [
    "assets/images/companies/ti.webp",
    "assets/images/companies/qualcomm.webp",
    "assets/images/companies/dell.webp",
    "assets/images/companies/nvidia.webp",
    "assets/images/companies/isro.webp",
    "assets/images/companies/samsung.webp",
    "assets/images/companies/nawe.webp",
    "assets/images/companies/grafito.webp",
    "assets/images/companies/aws.webp",
    "assets/images/companies/intel.webp",
    "assets/images/companies/ku.webp",
    "assets/images/companies/purdue.webp",
    "assets/images/companies/texas.webp",
    "assets/images/companies/ucdavis.webp",
    "assets/images/companies/visa.webp",
    "assets/images/companies/dxc.webp",
    "assets/images/companies/uidai.webp",
    "assets/images/companies/ns.webp",
    "assets/images/companies/kbr.webp",
    "assets/images/companies/caterpillar.webp"
];

const commonAltText = "Alumni company logo"; // New common alt text
const repeatTimes = 3;

for (let i = 0; i < repeatTimes; i++) {
    companyImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = commonAltText; // Added alt attribute
        companySlider.appendChild(img);
    });
}

/* Startup logos (static, colored, with links + labels) */
const startupGrid = document.getElementById('startupGrid');
const startups = [
    { src: "assets/images/startups/nawe.webp", link: "https://www.nmotion.in/", name: "NAWE ROBOTICS" },
    { src: "assets/images/startups/grafito.webp", link: "https://www.grafito.in/", name: "GRAFITO INNOVATIONS" }
];

startups.forEach(startup => {
    const wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "10px";

    const a = document.createElement('a');
    a.href = startup.link;
    a.target = "_blank"; // open in new tab

    const img = document.createElement('img');
    img.src = startup.src;
    img.alt = startup.name; // Alt attribute already set correctly here

    a.appendChild(img);

    const caption = document.createElement('div');
    caption.textContent = startup.name;
    caption.style.color = "white";
    caption.style.fontSize = "1rem";
    caption.style.textAlign = "center";

    wrapper.appendChild(a);
    wrapper.appendChild(caption);

    startupGrid.appendChild(wrapper);
});