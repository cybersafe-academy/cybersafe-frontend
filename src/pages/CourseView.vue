<template>
    <div v-if='course' class='tableContent'>
        <v-row> 
            <iframe class="course-video" :src="course.contentURL" title="BNT 418 Wspinaczka na Montparnasse w Paryżu 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </v-row>
        <v-row>
            <v-tabs
                v-model="currentTab"
            >
                <v-tab value='1'>
                    {{$t("COURSE_DESCRIPTION")}}
                </v-tab>
                <v-tab value='2'>
                    {{$t("REVIEWS")}}
                </v-tab>
                <v-tab value='3'>
                    {{$t("PRACTICAL_TEST")}}
                </v-tab>
            </v-tabs>
        </v-row>
        <v-row class='mt-9'>
            <v-window class='w-100' v-model="currentTab">
                <v-window-item value="1">
                    <a-row>
                        <p class='text-h4'>{{ course.title }}</p>
                    </a-row>
                    <a-row>
                        <p class='mt-4 text-h7'>{{ course.description }}</p>
                    </a-row>
                    <a-row>
                        <span class="mt-2 d-flex">
                            <b class="mr-1" style="color: #b4761a">{{course.avgRating.toFixed(1)}}</b>
                            <v-rating
                                class="rating d-flex align-center"
                                color="orange-lighten-1"
                                half-increments
                                v-model="course.avgRating"
                                readonly
                                density="compact"
                                size="small"
                            />
                        </span>
                    </a-row>
                    <hr class='mt-6 mb-4'>
                    <a-row>
                        <a-col style='max-width: 600px; margin-right: 200px;'>Autor</a-col>
                        <a-col>John Krasinki</a-col>
                    </a-row>
                    <hr class='mt-4 mb-4'>
                    <a-row>
                        <a-col style='max-width: 600px; margin-right: 200px;'>Demais informações</a-col>
                        <a-col>Curso de segurança</a-col>
                    </a-row>
                </v-window-item>
                <v-window-item value="2">
                    <div class='d-flex flex-column'>
                        <div class="w-100" v-if="!course.reviews.UserReviewedCourse">
                            <textarea v-model='newRatingComment' class="w-100 mb-6 pa-2" style='border: 1px solid grey;'></textarea>
                            <div class="d-flex align-center">
                                <v-rating
                                    class="rating d-flex align-center mt-2 mr-6"
                                    style='margin-left: -6px;'
                                    color="orange-lighten-1"
                                    half-increments
                                    v-model="newRating"
                                    density="compact"
                                />
                                <v-btn @click='sendReview' :disabled='!finishedRating' :class='finishedRating ? "bg-green" : "bg-grey"'>{{$t("SEND")}}</v-btn>
                            </div>
                        </div>
                        <v-divider class='mt-6 mb-4'/>
                        <div v-if="course.reviews.Reviews">
                            <div v-for="review in course.reviews.Reviews">
                                <UserReview :review='review' />
                                <v-divider class='mt-3'/>
                            </div>
                        </div>
                        <div v-else>
                            <p>No Reviews yet</p>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item v-if='course.questions' value="3">
                    <div class='mb-1' v-for='question, i in course.questions'>
                        <div class='question'>
                            <p class='text-h6'>{{i}}. {{question.description}}</p>
                        </div>
                        <div class='alternatives d-flex flex-column'>
                            <div :class='alternative.selected ? "alternative selected" : "alternative" ' v-for='alternative, j of question.alternatives' @click='setAlternative(question.alternatives, alternative)'>
                                <p class='text-h6'>{{j+1}}. {{alternative.description}}</p>
                            </div>
                        </div>
                    </div>
                    <div class='mt-4 d-flex justify-end'>
                        <v-btn class='bg-red mr-4' @click="resetAlternatives">{{$t("CLEAR_ANSWERS")}}</v-btn>
                        <v-btn :disabled='!finishedTest' :class='finishedTest ? "bg-green" : "bg-grey"'>{{$t("SEND")}}</v-btn>
                    </div>
                </v-window-item>
            </v-window>
        </v-row>
    </div>
</template>

<script lang="ts">
import UserReview from '@/components/UserReview.vue'

export default {
    name: 'CourseView',
    components: {
        UserReview
    },
    props: {
        courseId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentTab: 'teste',
            finishedTest: false,
            answeredQuestions: 0,
            newRatingComment: '',
            newRating: 0,
            course: undefined
        }
    },
    computed: {
        finishedRating: function () {
            return this.newRating && this.newRatingComment !== ''
        }
    },
    created: async function () {
        await this.loadCourse();
        await this.loadReviews();
        await this.loadQuestions();
    },
    methods: {
        async loadCourse() {
            this.course = (await this.$axios.get(`courses/${this.courseId}`)).data;
            const isPortuguese = JSON.parse(localStorage.getItem("isPortuguese") || "false")
            if (isPortuguese) {
                this.course.title = this.course.titlePtBr
                this.course.description = this.course.descriptionPtBr
            }
        },
        async loadReviews() {
            this.course.reviews = (await this.$axios.get(`courses/${this.courseId}/reviews`)).data;
        },
        async loadQuestions() {
            this.course.questions = (await this.$axios.get(`courses/${this.courseId}/questions`)).data;
        },
        setAlternative(alternatives: any[], selectedAlternative: any) {
            alternatives.forEach(alternative=>alternative.selected = false);
            selectedAlternative.selected = true
            this.answeredQuestions++
            this.finishedTest = this.answeredQuestions >= Object.keys(this.course.questions).values.length
        },
        resetAlternatives() {
            this.answeredQuestions = 0;
            this.finishedTest = false;
            (Object as any).values(this.course.questions).forEach((question: any)=>question.alternatives.forEach((alternative: any)=>alternative.selected = false))
        },
        async sendReview() {
            const review = (await this.$axios.post(`courses/${this.courseId}/reviews`, {
                comment: this.newRatingComment,
                rating: this.newRating,
            })).data;

            this.course.reviews.Reviews.push(review);
            this.course.reviews.UserReviewedCourse = true;
        }
    }
}
</script>

<style scoped>
    .tableContent {
        width: 100%;
        height: 100%;
        padding: 2rem;
        overflow-y: scroll;
    }
    .course-video {
        width: 100%;
        height: 500px;
    }

    ::v-deep .v-rating__item label {
        display: flex;
        align-items: center;
    }
    .question {
        background-color: #D500F9;
        border-end-start-radius: 10px;
        border-end-end-radius: 10px;
        padding: 5px;
    }

    .alternative {
        cursor: pointer;
        padding: 10px;
    }

    .alternative:hover {
        background-color: #d8d8d8;
    }

    .selected {
        background-color: #bebebe;
    }

</style>