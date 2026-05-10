export const FORMULA_SECTIONS = [
  {
    id: 'quantum',
    title: 'Quantum & Atomic',
    items: [
      { name: 'Photon energy',               tex: 'E = h\\nu = \\dfrac{hc}{\\lambda}' },
      { name: 'de Broglie wavelength',        tex: '\\lambda = \\dfrac{h}{p}' },
      { name: 'Bohr energy levels',           tex: 'E_n = -\\dfrac{13.6\\,\\text{eV}}{n^2}' },
      { name: 'Rydberg formula',              tex: '\\dfrac{1}{\\lambda} = R_H\\!\\left(\\dfrac{1}{n_1^2}-\\dfrac{1}{n_2^2}\\right)' },
      { name: 'Boltzmann population ratio',   tex: '\\dfrac{N_2}{N_1} = \\dfrac{g_2}{g_1}\\,e^{-h\\nu/kT}' },
      { name: 'Heisenberg uncertainty',       tex: '\\Delta x\\,\\Delta p \\geq \\dfrac{\\hbar}{2}' },
      { name: 'Schrödinger (time-dep.)',      tex: 'i\\hbar\\,\\dfrac{\\partial\\Psi}{\\partial t} = \\hat{H}\\Psi' },
      { name: 'Probability density',          tex: 'P = |\\Psi|^2' },
    ],
  },
  {
    id: 'einstein',
    title: 'Einstein Coefficients',
    items: [
      { name: 'Stimulated emission rate',     tex: 'R_{21}^{\\text{stim}} = B_{21}\\,\\rho(\\nu)\\,N_2' },
      { name: 'Spontaneous emission rate',    tex: 'R_{21}^{\\text{spon}} = A_{21}\\,N_2' },
      { name: 'A / B ratio',                  tex: '\\dfrac{A_{21}}{B_{21}} = \\dfrac{8\\pi h\\nu^3}{c^3}' },
      { name: 'Radiative lifetime',           tex: 'A_{21} = 1/\\tau_R' },
      { name: 'Planck spectral energy density', tex: '\\rho(\\nu)=\\dfrac{8\\pi h\\nu^3}{c^3}\\cdot\\dfrac{1}{e^{h\\nu/kT}-1}' },
    ],
  },
  {
    id: 'laser',
    title: 'Laser Physics',
    items: [
      { name: 'Gain coefficient',             tex: 'g(\\nu) = \\sigma(\\nu)\\,(N_2 - N_1)' },
      { name: 'Threshold condition',          tex: 'g_{\\text{th}} = \\alpha_i + \\dfrac{1}{2L}\\ln\\!\\dfrac{1}{R_1 R_2}' },
      { name: 'Round-trip oscillation',       tex: 'R_1 R_2\\,e^{2(g-\\alpha_i)L} \\geq 1' },
      { name: 'Population inversion',         tex: '\\Delta N = N_2 - N_1 > 0' },
      { name: 'Laser rate equation',          tex: '\\dfrac{dN_2}{dt} = R_p - \\dfrac{N_2}{\\tau} - B_{21}\\rho N_2' },
      { name: 'Laser linewidth (HWHM)',       tex: '\\delta\\nu = \\dfrac{\\pi c\\,\\delta n}{n\\,F}\\quad (F=\\text{finesse})' },
    ],
  },
  {
    id: 'polarisation',
    title: 'Polarisation',
    items: [
      { name: "Malus's law",                  tex: 'I = I_0\\cos^2\\!\\theta' },
      { name: "Brewster's angle",             tex: '\\tan\\theta_B = n_2/n_1' },
      { name: 'Degree of polarisation',       tex: 'P = \\dfrac{I_{\\max}-I_{\\min}}{I_{\\max}+I_{\\min}}' },
      { name: 'Fresnel (reflected, TE)',      tex: 'r_s = \\dfrac{n_1\\cos\\theta_i - n_2\\cos\\theta_t}{n_1\\cos\\theta_i + n_2\\cos\\theta_t}' },
    ],
  },
  {
    id: 'fibre',
    title: 'Fibre Optics',
    items: [
      { name: "Snell's law",                  tex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2' },
      { name: 'Critical angle',               tex: '\\sin\\theta_c = n_2/n_1' },
      { name: 'Numerical aperture',           tex: '\\mathrm{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2-n_2^2}' },
      { name: 'V-number (mode parameter)',    tex: 'V = \\dfrac{2\\pi a}{\\lambda}\\,\\mathrm{NA}' },
      { name: 'Single-mode condition',        tex: 'V < 2.405' },
      { name: 'Relative index difference',    tex: '\\Delta = \\dfrac{n_1^2-n_2^2}{2n_1^2}\\approx\\dfrac{n_1-n_2}{n_1}' },
    ],
  },
  {
    id: 'loss',
    title: 'Loss & Dispersion',
    items: [
      { name: 'Attenuation coefficient',      tex: '\\alpha_{\\text{dB}} = \\dfrac{10}{L}\\log_{10}\\!\\dfrac{P_{\\text{in}}}{P_{\\text{out}}}' },
      { name: 'Material dispersion spread',   tex: '\\sigma_t = |D|\\,L\\,\\Delta\\lambda' },
      { name: 'Group velocity',               tex: 'v_g = \\dfrac{c}{n_g},\\quad n_g = n - \\lambda\\dfrac{dn}{d\\lambda}' },
      { name: 'Dispersion parameter D',       tex: 'D = -\\dfrac{\\lambda}{c}\\dfrac{d^2n}{d\\lambda^2}' },
      { name: 'Rayleigh scattering loss',     tex: '\\alpha_R \\propto \\lambda^{-4}' },
      { name: 'Intermodal dispersion time',   tex: '\\delta t = \\dfrac{L\\,\\mathrm{NA}^2}{2\\,n_1\\,c}' },
    ],
  },
];
