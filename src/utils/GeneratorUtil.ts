class GeneratorUtil {

    generateRandomPassWord() {
        return Math.random().toString(36).slice(-10);
    }

}

export default GeneratorUtil;