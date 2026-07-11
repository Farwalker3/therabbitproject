class ReviewWizard {
    constructor() {
        this.currentStep = 0
        this.totalSteps = 8 // 6 categories + overall + review
        this.ratings = {}
        this.overallRating = 0
        this.reviewText = ""
        this.gameName = gameName || "the game";
        this.starsScale = 10

        this.categories = [
            { id: "graphics", name: "Graphics", icon: "🎨" },
            { id: "gameplay", name: "Gameplay", icon: "🎮" },
            { id: "earnings", name: "Earnings", icon: "💰" },
            { id: "trading", name: "Trading", icon: "📈" },
            { id: "mechanics", name: "Mechanics", icon: "🛠️" },
            //{ id: "value", name: "Value for Money", icon: "💰" },
        ]

        this.ratingOptions = [
            { value: 0, label: "Very Satisfied", emoji: "😍" },
            { value: 1, label: "Not Satisfied", emoji: "😊" },
            { value: 2, label: "Neutral", emoji: "😐" },
            { value: 3, label: "N/A", emoji: "🚫" },
        ]

        this.init()
    }

    init() {
        this.bindEvents()
        this.updateProgress()
        this.renderCurrentStep()
    }

    bindEvents() {
        // Open modal (button is absent when user already reviewed)
        const openBtn = document.getElementById("review-wizard-open-btn");
        if (openBtn) {
            openBtn.addEventListener("click", () => {
                this.openModal()
            })
        }

        // Close modal
        document.getElementById("review-wizard-close-modal").addEventListener("click", () => {
            this.closeModal()
        })

        // Close on backdrop click
        document.getElementById("review-wizard-modal").addEventListener("click", (e) => {
            if (e.target.id === "review-wizard-modal") {
                this.closeModal()
            }
        })

        // Navigation
        document.getElementById("review-wizard-back-btn").addEventListener("click", () => {
            this.goBack()
        })

        document.getElementById("review-wizard-next-btn").addEventListener("click", async () => {
            let goNextResult = await this.goNext();

        })

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (document.getElementById("review-wizard-modal").classList.contains("review-wizard-active")) {
                if (e.key === "Escape") {
                    this.closeModal()
                }
            }
        })
    }

    openLoginRegisterDialog() {
        if (typeof jQuery !== 'undefined' && jQuery('#rb-user-popup-form').length) {
            jQuery('#rb-user-popup-form').css({
                'position': 'fixed',
                'top': '50%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'z-index': '9999',
                'display': 'block'
            }).removeClass('mfp-hide').addClass('mfp-show');
        } else {
            alert('Please log in to write a review.');
        }
        return false;
    }

    openModal() {
        if (!window.cgUserId || window.cgUserId == 0) {
            return this.openLoginRegisterDialog();
        }
        document.getElementById("review-wizard-modal").classList.add("review-wizard-active")
        document.body.style.overflow = "hidden"
    }

    closeModal() {
        document.getElementById("review-wizard-modal").classList.remove("review-wizard-active")
        document.body.style.overflow = ""
    }

    updateProgress() {
        const progress = ((this.currentStep + 1) / this.totalSteps) * 100
        document.getElementById("review-wizard-step-info").textContent =
            `Step ${this.currentStep + 1} of ${this.totalSteps}`
        document.getElementById("review-wizard-progress-percent").textContent = `${Math.round(progress)}% Complete`
        document.getElementById("review-wizard-progress-fill").style.width = `${progress}%`

        // Update navigation buttons
        const backBtn = document.getElementById("review-wizard-back-btn")
        const nextBtn = document.getElementById("review-wizard-next-btn")

        backBtn.disabled = this.currentStep === 0

        if (this.currentStep === this.totalSteps - 1) {
            nextBtn.innerHTML = "Submit Review"
        } else {
            nextBtn.innerHTML = 'Next <span class="review-wizard-icon">›</span>'
        }

        nextBtn.disabled = !this.canProceed()
    }

    canProceed() {
        if (this.currentStep < this.categories.length) {
            return this.ratings[this.categories[this.currentStep].id] !== undefined
        } else if (this.currentStep === this.categories.length) {
            return this.overallRating > 0
        }
        return true
    }

    renderCurrentStep() {
        const stepContent = document.getElementById("review-wizard-step-content")

        if (this.currentStep < this.categories.length) {
            stepContent.innerHTML = this.renderCategoryStep()
        } else if (this.currentStep === this.categories.length) {
            stepContent.innerHTML = this.renderOverallStep()
        } else {
            stepContent.innerHTML = this.renderReviewStep()
        }

        this.bindStepEvents()
    }

    renderCategoryStep() {
        const category = this.categories[this.currentStep]
        const selectedRating = this.ratings[category.id]

        return `
      <div class="review-wizard-step-inner">
        <div class="review-wizard-step-header">
          <div class="review-wizard-step-icon">${category.icon}</div>
          <h3 class="review-wizard-step-title">${category.name}</h3>
          <p class="review-wizard-step-description">
            How would you rate the ${category.name.toLowerCase()} of ${this.gameName}?
          </p>
        </div>
        
        <div class="review-wizard-rating-grid">
          ${this.ratingOptions
                .map(
                    (option) => `
            <div class="review-wizard-rating-card ${selectedRating === option.value ? "review-wizard-selected" : ""}" 
                 data-category="${category.id}" data-rating="${option.value}">
              <span class="review-wizard-rating-emoji">${option.emoji}</span>
              <div class="review-wizard-rating-label">${option.label}</div>
              ${option.value > 0
                            ? `
                  <div class="review-wizard-rating-stars" style="display:none;">
                    ${Array(option.value)
                                .fill()
                                .map(
                                    () =>
                                        '<svg class="review-wizard-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                                )
                                .join("")}
                  </div>
                `
                            : ""
                        }
            </div>
          `,
                )
                .join("")}
        </div>
      </div>
    `
    }

    renderOverallStep() {
        return `
      <div class="review-wizard-step-inner">
        <div class="review-wizard-step-header">
          <div class="review-wizard-step-icon">⭐</div>
          <h3 class="review-wizard-step-title">Overall Rating</h3>
          <p class="review-wizard-step-description">What's your overall rating for ${this.gameName}?</p>
        </div>
        
        <div class="review-wizard-star-rating">
          ${Array(this.starsScale)
                .fill()
                .map(
                    (_, i) => `
            <button class="review-wizard-star-btn" data-star="${i + 1}">
              <svg class="review-wizard-star-large ${i < this.overallRating ? "review-wizard-active" : ""}" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </button>
          `,
                )
                .join("")}
        </div>
        
        ${this.overallRating > 0 ? `<div class="review-wizard-overall-score">${this.overallRating}/${this.starsScale} Stars</div>` : ""}
      </div>
    `
    }

    renderReviewStep() {
        return `
      <div class="review-wizard-step-inner">
        <div class="review-wizard-step-header">
          <div class="review-wizard-step-icon">✍️</div>
          <h3 class="review-wizard-step-title">Write Your Review</h3>
          <p class="review-wizard-step-description">Share your thoughts about ${this.gameName} (optional)</p>
        </div>
        
        <div class="review-wizard-form-group">
          <label class="review-wizard-form-label" for="review-wizard-review-text">Your Review</label>
          <textarea maxlength="500" 
            rows="5"
            id="review-wizard-review-text" 
            class="review-wizard-form-textarea" 
            placeholder="Tell other players what you think about this game..."
          >${this.reviewText}</textarea>
        </div>
      </div>
    `
    }

    bindStepEvents() {
        // Category rating selection
        document.querySelectorAll(".review-wizard-rating-card").forEach((card) => {
            card.addEventListener("click", () => {
                const category = card.dataset.category
                const rating = Number.parseInt(card.dataset.rating)
                this.selectRating(category, rating)
            })
        })

        // Star rating selection
        document.querySelectorAll(".review-wizard-star-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const star = Number.parseInt(btn.dataset.star)
                this.selectOverallRating(star)
            })
        })

        // Review text
        const reviewTextarea = document.getElementById("review-wizard-review-text")
        if (reviewTextarea) {
            reviewTextarea.addEventListener("input", (e) => {
                this.reviewText = e.target.value
            })
        }
    }

    selectRating(category, rating) {
        this.ratings[category] = rating

        // Update UI
        document.querySelectorAll(`[data-category="${category}"]`).forEach((card) => {
            card.classList.remove("review-wizard-selected")
        })
        document
            .querySelector(`[data-category="${category}"][data-rating="${rating}"]`)
            .classList.add("review-wizard-selected")

        this.updateProgress()
    }

    selectOverallRating(rating) {
        this.overallRating = rating

        // Update stars
        document.querySelectorAll(".review-wizard-star-large").forEach((star, index) => {
            if (index < rating) {
                star.classList.add("review-wizard-active")
            } else {
                star.classList.remove("review-wizard-active")
            }
        })

        // Update score display
        const scoreElement = document.querySelector(".review-wizard-overall-score")
        if (scoreElement) {
            scoreElement.textContent = `${rating}/${this.starsScale} Stars`
        } else {
            // Add score display if it doesn't exist
            const starRating = document.querySelector(".review-wizard-star-rating")
            starRating.insertAdjacentHTML("afterend", `<div class="review-wizard-overall-score">${rating}/${this.starsScale} Stars</div>`)
        }

        this.updateProgress()
    }

    goBack() {
        if (this.currentStep > 0) {
            this.currentStep--
            this.updateProgress()
            this.renderCurrentStep()
        }
    }

    async goNext() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++
            this.updateProgress()
            this.renderCurrentStep()
        } else {
            await this.submitReview()
        }
    }

    async saveUserRating(the_user_rating) {
        const nonce   = window.cgReviewNonce || '';
        const ajaxUrl = window.ajaxurl || '/wp-admin/admin-ajax.php';

        const payload = {
            dapp_id:        window.cgPostId || 0,
            content:        the_user_rating.reviewText || '',
            overall_rating: the_user_rating.overallRating,
            ratings:        Object.entries(the_user_rating.ratings).map(([id, rating]) => ({ id, rating })),
        };

        const response = await fetch(
            ajaxUrl + '?action=dapps_add_review&nonce=' + encodeURIComponent(nonce),
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(payload),
            }
        );

        return response.json();
    }

    async submitReview() {
        const reviewData = {
            ratings:       this.ratings,
            overallRating: this.overallRating,
            reviewText:    this.reviewText,
        };

        try {
            const result = await this.saveUserRating(reviewData);
            this.closeModal();
            this.resetWizard();

            if (result && result.success) {
                cgShowToast('Your review was saved successfully.');
                if (result.data.new_avg) {
                    const scoreEl = document.querySelector('.cg-score-display');
                    if (scoreEl) scoreEl.textContent = parseFloat(result.data.new_avg).toFixed(1);
                    const countEl = document.getElementById('cg-reviews-count');
                    if (countEl) {
                        const n = result.data.new_count;
                        countEl.textContent = 'Based on ' + n + ' review' + (n !== 1 ? 's' : '');
                    }
                    // Update hero badge too
                    const heroRating = document.getElementById('cg-hero-rating-val');
                    if (heroRating) heroRating.textContent = parseFloat(result.data.new_avg).toFixed(1);
                }
                if (result.data.review) {
                    cgPrependReview(result.data.review);
                }
                // Hide the "Write a Review" button since user has now reviewed
                const btn = document.getElementById('review-wizard-open-btn');
                if (btn) btn.style.display = 'none';
                const alreadyMsg = document.getElementById('cg-already-reviewed');
                if (alreadyMsg) alreadyMsg.style.display = 'block';
            } else {
                const errMap = {
                    'already_reviewed': 'You have already reviewed this game.',
                    'not_logged_in':    'Please log in to submit a review.',
                    'invalid_nonce':    'Session expired. Please refresh the page.',
                };
                alert(errMap[result.data] || 'Failed to submit review. Please try again.');
            }
        } catch (err) {
            console.error('Review submission failed:', err);
            alert('Failed to submit review. Please try again.');
        }
    }

    resetWizard() {
        this.currentStep = 0
        this.ratings = {}
        this.overallRating = 0
        this.reviewText = ""
        this.updateProgress()
        this.renderCurrentStep()
    }
}

// Initialize the wizard when the page loads
document.addEventListener("DOMContentLoaded", () => {
    new ReviewWizard();
})

function cgShowToast(message) {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#00dbe9;color:#111;padding:12px 24px;border-radius:8px;font-weight:600;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.4);';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

function cgCategoryLabel(val) {
    const labels = { 0: 'Very Satisfied', 1: 'Not Satisfied', 2: 'Neutral', 3: 'N/A' };
    return labels[val] !== undefined ? labels[val] : '';
}

function cgPrependReview(review) {
    const list = document.getElementById('cg-reviews-list');
    if (!list) return;

    const noReviews = document.getElementById('cg-no-reviews');
    if (noReviews) noReviews.remove();

    const card = document.createElement('div');
    card.className = 'review-card';

    // Header row: avatar + author + date | star rating
    const header = document.createElement('div');
    header.className = 'review-header';

    const avatarEl = document.createElement('div');
    avatarEl.className = 'reviewer-avatar';
    avatarEl.textContent = review.author ? review.author.charAt(0).toUpperCase() : '?';

    const authorEl = document.createElement('h4');
    authorEl.textContent = review.author || '';

    const dateSpan = document.createElement('span');
    dateSpan.textContent = review.date || '';
    const metaEl = document.createElement('div');
    metaEl.className = 'reviewer-meta';
    metaEl.appendChild(dateSpan);

    const detailsEl = document.createElement('div');
    detailsEl.className = 'reviewer-details';
    detailsEl.appendChild(authorEl);
    detailsEl.appendChild(metaEl);

    const infoEl = document.createElement('div');
    infoEl.className = 'reviewer-info';
    infoEl.appendChild(avatarEl);
    infoEl.appendChild(detailsEl);

    const starsEl = document.createElement('div');
    starsEl.className = 'stars';
    starsEl.textContent = '\u2605'.repeat(review.overall_rating) + '\u2606'.repeat(10 - review.overall_rating);

    const ratingNumEl = document.createElement('div');
    ratingNumEl.className = 'rating-number';
    ratingNumEl.textContent = review.overall_rating + '/10';

    const ratingEl = document.createElement('div');
    ratingEl.className = 'review-rating';
    ratingEl.appendChild(starsEl);
    ratingEl.appendChild(ratingNumEl);

    header.appendChild(infoEl);
    header.appendChild(ratingEl);
    card.appendChild(header);

    // Review text
    if (review.content) {
        const textEl = document.createElement('p');
        textEl.className = 'review-text';
        textEl.textContent = review.content;
        const contentEl = document.createElement('div');
        contentEl.className = 'review-content';
        contentEl.appendChild(textEl);
        card.appendChild(contentEl);
    }

    // Category ratings
    const cats = [
        { key: 'graphics',  label: 'Graphics'  },
        { key: 'gameplay',  label: 'Gameplay'  },
        { key: 'earnings',  label: 'Earnings'  },
        { key: 'trading',   label: 'Trading'   },
        { key: 'mechanics', label: 'Mechanics' },
    ];
    const catsWithValues = cats.filter(function(c) { return review[c.key] !== undefined && review[c.key] >= 0; });
    if (catsWithValues.length > 0) {
        const catsTitle = document.createElement('div');
        catsTitle.className = 'category-ratings-title';
        catsTitle.textContent = 'Category Ratings';
        const grid = document.createElement('div');
        grid.className = 'category-ratings-grid';
        catsWithValues.forEach(function(c) {
            const nameEl = document.createElement('span');
            nameEl.className = 'category-name';
            nameEl.textContent = c.label;
            const valEl = document.createElement('span');
            valEl.style.cssText = 'font-size:12px;color:#9ca3af;margin-left:8px;';
            valEl.textContent = cgCategoryLabel(review[c.key]);
            const item = document.createElement('div');
            item.className = 'category-rating-item';
            item.appendChild(nameEl);
            item.appendChild(valEl);
            grid.appendChild(item);
        });
        const catsSection = document.createElement('div');
        catsSection.className = 'category-ratings';
        catsSection.appendChild(catsTitle);
        catsSection.appendChild(grid);
        card.appendChild(catsSection);
    }

    list.prepend(card);
}
