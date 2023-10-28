<template>
    <div>
        <h2 class="mb-6">Contents</h2>
        <div style="padding: 3px;">
            <template v-if="questions.length === 0">
                <h2>No contents registered yet</h2>
            </template>
            <template v-else v-for="(question, i) in questions" v-key='i'>
                <div style="margin-bottom: 20px">
                    <course-test-item :question="question"
                        @remove-item="removeCourseContent(i)"></course-test-item>
                </div>
            </template>
            <div class="d-flex flex-end">
                <v-icon
                    style="background-color: green; color: white;width: 30px; height: 30px;margin-left: auto; border-radius: 50%"
                    @click="addCourseContent">mdi-plus</v-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CourseTestItem from '@/components/CourseTestItem.vue'
export default {
    name: 'CourseTestForm',
    props: {
        questions: {
            type: Array,
            required: true
        }
    },
    components: {
        CourseTestItem
    },
    methods: {
        addCourseContent() {
            this.questions.push({
                answers: [{},{},{},{}],
            })
        },
        removeCourseContent(index: number) {
            setTimeout(()=>this.questions.splice(index, 1), 20)
        }
    }
}
</script>